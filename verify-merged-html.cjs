const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const required = [
  'SỬ DỤNG AI HỖ TRỢ', 'THÀNH VIÊN NHÓM',
  'NotebookLM', 'ChatGPT', 'Gemini', 'Claude',
  'Lê Tấn Lực', 'SE184288', 'Đỗ Hoàng Hiếu', 'SE184340',
  'Nguyễn Thị Anh Thư', 'SE184907',
  'Nguyễn Thị Thùy Dung', 'SS180809',
  'Nguyễn Hoàng Ngọc Minh', 'SS196544'
];
let failed = false;
for (const text of required) {
  const present = html.includes(text);
  console.log(`${present ? 'OK' : 'THIẾU'}: ${text}`);
  if (!present) failed = true;
}
const count = value => html.split(value).length - 1;
console.log('Khối CSS bổ sung:', count('id="added-pages-styles"'));
console.log('Khối JS bổ sung:', count('id="added-pages-script"'));
console.log('scrollbar không tương thích:', count('scrollbar-width') + count('scrollbar-color'));
console.log('min-height auto:', count('min-height:auto'));
const scriptMatch = html.match(/<script id="added-pages-script">([\s\S]*?)<\/script>/);
if (!scriptMatch) failed = true;
else {
  try { new Function(scriptMatch[1]); console.log('JavaScript bổ sung: hợp lệ'); }
  catch (error) { failed = true; console.error('JavaScript bổ sung lỗi:', error.message); }
}
if (count('id="added-pages-styles"') !== 1 || count('id="added-pages-script"') !== 1) failed = true;
process.exit(failed ? 1 : 0);
