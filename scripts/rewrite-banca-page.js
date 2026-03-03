const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remover states não usados
content = content.replace(/const \[activeTab, setActiveTab\] = useState\('basico'\);\n/g, '');
content = content.replace(/const tabs = \[[\s\S]*?\];\n\s*\/\/ Horários/g, '// Horários');
content = content.replace(/const TabNextButton = \(\{ onClick \}: \{ onClick: \(\) => void \}\) => \([\s\S]*?\);\n/g, '');

const returnIndex = content.lastIndexOf('return (');
if (returnIndex === -1) {
  console.error("Não encontrou o return final");
  process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);

fs.writeFileSync(path.join(__dirname, 'banca-page-part1.txt'), beforeReturn);
console.log("Parte 1 salva");
