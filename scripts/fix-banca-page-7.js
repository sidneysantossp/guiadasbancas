const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix Link import
if (!content.includes('import Link from "next/link";')) {
  content = content.replace(/import \{ useRouter, useParams \} from "next\/navigation";/g, 'import { useRouter, useParams } from "next/navigation";\nimport Link from "next/link";');
}

// Fix handleDelete
content = content.replace(/onClick=\{handleDelete\}/g, 'onClick={handleDeleteBanca}');

// Fix boolean error on line 731. Let's check what's there.
// Probably `<input type="checkbox" className="sr-only" checked={day.start} ... />`
content = content.replace(/checked=\{day\.start\}/g, 'checked={day.open}');
content = content.replace(/checked=\{day\.end\}/g, 'checked={day.open}');

fs.writeFileSync(filePath, content);
console.log("Correções finais aplicadas parte 7");
