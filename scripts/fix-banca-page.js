const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename states and handlers in the return block
content = content.replace(/onSubmit={handleSubmit}/g, 'onSubmit={saveBanca}');
content = content.replace(/value={owner}/g, 'value={ownerEmail}'); // or remove owner input since we have ownerEmail below
content = content.replace(/onChange={\(e\) => setOwner\(e\.target\.value\)}/g, 'disabled');
content = content.replace(/onClick={handleResetPassword}/g, 'onClick={handleResetPwd}');
content = content.replace(/handleCepBlur/g, 'fetchCep');
content = content.replace(/value={state}/g, 'value={uf}');
content = content.replace(/setState/g, 'setUf');
content = content.replace(/onSelect={handleCotistaSelect}/g, 'onSelect={(c) => setSelectedCotista(c ? { id: c.id, codigo: c.codigo, razao_social: c.razao_social, cnpj_cpf: c.cnpj_cpf } : null)}');

// 2. Fix hours array properties
content = content.replace(/day\.id/g, 'day.key');
content = content.replace(/day\.active/g, 'day.open');
content = content.replace(/day\.day/g, 'day.label');
content = content.replace(/day\.open/g, 'day.start');
content = content.replace(/day\.close/g, 'day.end');

fs.writeFileSync(filePath, content);
console.log("Correções aplicadas");
