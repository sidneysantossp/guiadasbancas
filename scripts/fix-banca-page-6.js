const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/onSubmit=\{handleSave\}/g, 'onSubmit={onSubmit}');
content = content.replace(/onClick=\{handleResetPwd\}/g, 'onClick={onResetPassword}');
content = content.replace(/handleCepBlur/g, 'handleCepChange');
content = content.replace(/fetchCep/g, 'handleCepChange');

// fixing hours mapping issues
// <input type="time" ... value={day.start} onChange={(e) => { ... newHours[index].start = e.target.value; ... }}
// But it seems earlier I replaced day.open with day.start on line 710? Let's check where the boolean error comes from.
// checked={day.start}  -> checked={day.open}
content = content.replace(/checked=\{day\.start\}/g, 'checked={day.open}');
// the transition color and transform logic also uses day.start instead of day.open
content = content.replace(/\$\{day\.start \? 'bg-primary' : 'bg-gray-300'\}/g, "${day.open ? 'bg-primary' : 'bg-gray-300'}");
content = content.replace(/\$\{day\.start \? 'transform translate-x-4' : ''\}/g, "${day.open ? 'transform translate-x-4' : ''}");
content = content.replace(/newHours\[index\]\.active = e\.target\.checked/g, 'newHours[index].open = e.target.checked');
content = content.replace(/disabled=\{\!day\.active\}/g, 'disabled={!day.open}');
content = content.replace(/\{\!day\.active && \(/g, '{!day.open && (');
content = content.replace(/value=\{day\.close\}/g, 'value={day.end}');
content = content.replace(/newHours\[index\]\.close = e\.target\.value/g, 'newHours[index].end = e.target.value');

// images
content = content.replace(/setAvatarUrl/g, 'handleAvatarChange');
content = content.replace(/avatarUrl/g, 'avatar');
content = content.replace(/setCoverUrl/g, 'handleCoverChange');
content = content.replace(/coverUrl/g, 'cover');

// loadingCategories
content = content.replace(/loadingCategories/g, 'loading');

fs.writeFileSync(filePath, content);
console.log("Correções finais aplicadas");
