const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/  \/\/ Navegação entre abas\n[\s\S]*?const TabNextButton = \(\) => \([\s\S]*?\n  \);\n/g, '');

fs.writeFileSync(filePath, content);
console.log("Removido navegação de abas");
