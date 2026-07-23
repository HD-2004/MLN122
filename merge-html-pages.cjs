const fs = require('fs');

const sourceFile = 'index.html.html';
const addonFile = 'merge-pages-addon.html';
let html = fs.readFileSync(sourceFile, 'utf8');
const addon = fs.readFileSync(addonFile, 'utf8');

html = html.replace(/<style id="added-pages-styles">[\s\S]*?<\/script>/, '');
html = html.replace(/scrollbar-width:[^;}]+;?/g, '');
html = html.replace(/scrollbar-color:[^;}]+;?/g, '');
html = html.replace(/min-height\s*:\s*auto/g, 'min-height:0');
html = html.replace(
  /-webkit-backdrop-filter:([^;]+);(?!backdrop-filter:)/g,
  '-webkit-backdrop-filter:$1;backdrop-filter:$1;'
);

if (!html.includes('</body>')) throw new Error('Không tìm thấy thẻ đóng body.');
html = html.replace('</body>', `${addon}\n</body>`);
fs.writeFileSync(sourceFile, html, 'utf8');
