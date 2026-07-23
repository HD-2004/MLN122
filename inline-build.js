import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('--- BẮT ĐẦU ĐÓNG GÓI DỰ ÁN THÀNH 1 FILE HTML DUY NHẤT ---');

// 1. Chạy Build dự án React/Vite
console.log('1. Đang build dự án bằng Vite...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Lỗi khi build dự án:', error);
  process.exit(1);
}

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('Không tìm thấy tệp index.html sau khi build.');
  process.exit(1);
}

console.log('2. Đang đọc các tệp build...');
let html = fs.readFileSync(htmlPath, 'utf-8');

const resolveBuiltAsset = (assetPath) => {
  const normalized = assetPath.split('?')[0].replace(/^\/+/, '');
  const withoutBase = normalized.replace(/^MLN122\//, '');
  return path.join(distDir, withoutBase);
};

// 2. Tìm và nhúng CSS inline
const cssRegex = /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g;
html = html.replace(cssRegex, (match, cssPath) => {
  // Lấy đường dẫn chính xác (bỏ ký tự / ở đầu nếu có)
  const absoluteCssPath = resolveBuiltAsset(cssPath);
  
  if (fs.existsSync(absoluteCssPath)) {
    console.log(`   > Nhúng CSS inline: ${cssPath}`);
    const cssContent = fs.readFileSync(absoluteCssPath, 'utf-8');
    return `<style>${cssContent}</style>`;
  }
  return match;
});

// 3. Tìm các file JS để nhúng inline và xử lý chuyển đổi hình ảnh public sang Base64
const jsRegex = /<script[^>]*src="([^"]+)"[^>]*><\/script>/g;
html = html.replace(jsRegex, (match, jsPath) => {
  const absoluteJsPath = resolveBuiltAsset(jsPath);
  
  if (fs.existsSync(absoluteJsPath)) {
    console.log(`   > Đọc file JS để nhúng: ${jsPath}`);
    let jsContent = fs.readFileSync(absoluteJsPath, 'utf-8');

    // Chuyển toàn bộ hình ảnh trong thư mục public thành Base64 và thay thế trong code JS
    console.log('3. Đang chuyển đổi hình ảnh nội bộ sang Base64...');
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir);
      publicFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
          const filePath = path.join(publicDir, file);
          const extName = ext.substring(1);
          const mime = extName === 'svg' ? 'image/svg+xml' : extName === 'jpg' || extName === 'jpeg' ? 'image/jpeg' : `image/${extName}`;
          const base64 = fs.readFileSync(filePath, 'base64');
          const dataUrl = `data:${mime};base64,${base64}`;

          // Thay thế đường dẫn tĩnh dạng "/filename.png" trong file JS thành chuỗi Base64
          const targetPath = `/${file}`;
          const count = jsContent.split(targetPath).length - 1;
          if (count > 0) {
            jsContent = jsContent.split(targetPath).join(dataUrl);
            console.log(`     + Đã tích hợp hình ảnh: ${file} (${count} vị trí)`);
          }
        }
      });
    }

    return `<script type="module">${jsContent}</script>`;
  }
  return match;
});

// 4. Xử lý nốt hình ảnh tĩnh nếu có khai báo trực tiếp trong index.html
const imgRegex = /src="\/([^"]+\.(png|jpg|jpeg|svg|gif))"/g;
html = html.replace(imgRegex, (match, imgPath) => {
  const absoluteImgPath = path.join(publicDir, imgPath);
  if (fs.existsSync(absoluteImgPath)) {
    const ext = path.extname(imgPath).substring(1);
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    const base64 = fs.readFileSync(absoluteImgPath, 'base64');
    return `src="data:${mime};base64,${base64}"`;
  }
  return match;
});

// 5. Ghi tệp HTML duy nhất
const outputPath = path.join(distDir, 'mln-2-standalone.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('\n-----------------------------------------------------------');
console.log('ĐÓNG GÓI THÀNH CÔNG!');
console.log(`Tệp HTML độc lập đã được tạo tại:`);
console.log(outputPath);
console.log('Bạn chỉ cần gửi duy nhất file này cho người khác.');
console.log('Họ chỉ cần nhấp đúp để mở trên bất kỳ trình duyệt nào mà không cần cài đặt code!');
console.log('-----------------------------------------------------------');
