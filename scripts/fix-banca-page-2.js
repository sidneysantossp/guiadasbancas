const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix event handlers
content = content.replace(/onSubmit={saveBanca}/g, 'onSubmit={handleSubmit}');
content = content.replace(/onClick={handleResetPwd}/g, 'onClick={handleResetPassword}');
content = content.replace(/fetchCep/g, 'handleCepBlur');

// Fix Hours array usage
// Replace day.start for checkbox checked to day.open
content = content.replace(/checked={day\.start}/g, 'checked={day.open}');
content = content.replace(/className={\`block w-10 h-6 rounded-full transition-colors \$\{day\.start \? 'bg-primary' : 'bg-gray-300'\}\`\}><\/div>/g, 'className={`block w-10 h-6 rounded-full transition-colors ${day.open ? \'bg-primary\' : \'bg-gray-300\'}`}></div>');
content = content.replace(/className={\`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform \$\{day\.start \? 'transform translate-x-4' : ''\}\`\}><\/div>/g, 'className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${day.open ? \'transform translate-x-4\' : \'\'}`}></div>');
content = content.replace(/newHours\[index\]\.active = e\.target\.checked/g, 'newHours[index].open = e.target.checked');
content = content.replace(/disabled={\!day\.active}/g, 'disabled={!day.open}');
content = content.replace(/\{\!day\.active && \(/g, '{!day.open && (');
content = content.replace(/newHours\[index\]\.close = e\.target\.value/g, 'newHours[index].end = e.target.value');
content = content.replace(/value={day\.close}/g, 'value={day.end}');

// Fix images state variables
// Assuming original file had: image, setImage, cover_image, setCoverImage, gallery_images, setGalleryImages
// Let's check what states are actually there first.
