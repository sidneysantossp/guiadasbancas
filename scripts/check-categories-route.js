const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname, '../app/api/admin/distribuidores/[id]/sync/route.ts'), 'utf8');

console.log(file.substring(0, 500));
