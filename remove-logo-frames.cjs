const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const marker = '</style>\n<script id="added-pages-script">';
const css = `.added-logo-grid{width:min(1000px,100%);grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(24px,4vw,56px);align-items:center;justify-items:center}.added-logo-card{width:100%;min-height:0;padding:0;border:0;border-radius:0;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:none;display:grid;place-items:center}.added-logo-frame{width:clamp(150px,16vw,200px);height:clamp(150px,16vw,200px);padding:0;border:0;border-radius:0;background:transparent;display:grid;place-items:center;overflow:hidden}.added-logo-image{width:100%;height:100%;object-fit:contain;object-position:center;border-radius:0}@media(max-width:920px){.added-logo-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:520px;gap:28px}.added-logo-card{min-height:0;padding:0}.added-logo-frame{width:clamp(140px,36vw,190px);height:clamp(140px,36vw,190px)}}@media(max-width:440px){.added-logo-grid{gap:20px}.added-logo-frame{width:min(38vw,160px);height:min(38vw,160px)}}`;

if (!html.includes(marker)) throw new Error('Không tìm thấy khối CSS của hai trang bổ sung.');
html = html.replace(marker, `${css}</style>\n<script id="added-pages-script">`);
fs.writeFileSync(file, html);
