const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const aiOld = 'ai.innerHTML=`<div class="added-page-shell"><h1 class="added-page-title">SỬ DỤNG AI HỖ TRỢ</h1><div class="added-logo-grid">${logos.map(([n,l])=>`<article class="added-logo-card"><div class="added-logo-frame">${l}</div></article>`).join("")}</div></div>`;';
const aiNew = 'ai.innerHTML=`<div class="added-page-shell"><h1 class="added-page-title">SỬ DỤNG AI HỖ TRỢ</h1><div class="added-logo-grid">${logos.map(([n,l])=>`<article class="added-logo-card"><div class="added-logo-frame">${l}</div></article>`).join("")}</div><button type="button" class="primary added-flow-button added-ai-continue">Tiếp tục</button></div>`;';

const teamOld = 'team.innerHTML=`<div class="added-page-shell"><h1 class="added-page-title">THÀNH VIÊN NHÓM</h1><div class="added-team-list">${members.map(([n,id])=>`<article class="added-member"><div class="added-avatar">${userIcon}</div><div class="added-member-info"><span class="added-member-name">${n}</span><span class="added-member-id">${id}</span></div></article>`).join("")}</div></div>`;';
const teamNew = 'team.innerHTML=`<div class="added-page-shell"><h1 class="added-page-title">THÀNH VIÊN NHÓM</h1><div class="added-team-list">${members.map(([n,id])=>`<article class="added-member"><div class="added-avatar">${userIcon}</div><div class="added-member-info"><span class="added-member-name">${n}</span><span class="added-member-id">${id}</span></div></article>`).join("")}</div><button type="button" class="primary added-flow-button added-team-restart">Khám phá lại từ đầu</button></div>`;';

if (!html.includes(aiOld)) throw new Error('Không tìm thấy template trang AI.');
if (!html.includes(teamOld)) throw new Error('Không tìm thấy template trang thành viên.');
html = html.replace(aiOld, aiNew).replace(teamOld, teamNew);

const teamNavOld = 'addNav("Thành viên",team,';
const teamNavNew = 'const teamNav=addNav("Thành viên",team,';
if (!html.includes(teamNavOld)) throw new Error('Không tìm thấy nút điều hướng thành viên.');
html = html.replace(teamNavOld, teamNavNew);

const handlerAnchor = 'const continueButton=[...originalScreens.at(-1).querySelectorAll("button")]';
const handlers = 'ai.querySelector(".added-ai-continue").addEventListener("click",()=>activate(team,teamNav));team.querySelector(".added-team-restart").addEventListener("click",()=>originalButtons[0].click());const continueButton=[...originalScreens.at(-1).querySelectorAll("button")]';
if (!html.includes(handlerAnchor)) throw new Error('Không tìm thấy điểm gắn sự kiện nút.');
html = html.replace(handlerAnchor, handlers);

const styleEnd = /<\/style>\s*<script id="added-pages-script">/;
const buttonCss = '.added-flow-button{position:relative;z-index:2;margin-top:36px;flex:0 0 auto}.added-team-page .added-flow-button{margin-top:28px}@media(max-width:920px){.added-flow-button{margin-top:28px}}';
if (!styleEnd.test(html)) throw new Error('Không tìm thấy cuối khối CSS bổ sung.');
html = html.replace(styleEnd, `${buttonCss}</style>\n<script id="added-pages-script">`);

fs.writeFileSync(file, html);
