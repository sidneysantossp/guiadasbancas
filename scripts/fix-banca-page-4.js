const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add gallery state if it's missing
if (!content.includes('const [gallery, setGallery]')) {
  content = content.replace(/const \[avatar, setAvatar\] = useState\(""\);/g, 'const [avatar, setAvatar] = useState("");\n  const [gallery, setGallery] = useState<string[]>([]);');
}

// Fix handleCepBlur -> fetchCep
content = content.replace(/handleCepBlur/g, 'fetchCep');

// Fix saveBanca -> handleSave
content = content.replace(/saveBanca/g, 'handleSave');

fs.writeFileSync(filePath, content);
console.log("Gallery state and handlers fixed");
