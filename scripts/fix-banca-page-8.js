const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix disabled={!day.start} to disabled={!day.open}
content = content.replace(/disabled=\{\!day\.start\}/g, 'disabled={!day.open}');

// Fix newHours[index].open = e.target.value; which is inside the input for start time
// We can use a regex or string replace. Let's find the exact block.
const blockToReplace = `                      value={day.start}
                      disabled={!day.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].open = e.target.value;`;

const newBlock = `                      value={day.start}
                      disabled={!day.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].start = e.target.value;`;

content = content.replace(blockToReplace, newBlock);

fs.writeFileSync(filePath, content);
console.log("Correções finais aplicadas parte 8");
