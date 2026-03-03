const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix imports back
content = content.replace(/import FileUploadDragDrop from "@\/components\/admin\/FileUploadDragDrop";/g, 'import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";');

// In useCategories, if it returns { categories, loading, error }, the banca page already uses `loading` for the page itself, so maybe it's `categoriesLoading`.
// Let's check useCategories declaration or usage.
// Replace `loadingCategories` with `false` or something safe if not destructured properly.

// Also `setGallery`
if (!content.includes('const [gallery, setGallery] = useState<string[]>([])')) {
  content = content.replace(/const \[avatar, setAvatar\] = useState\(""\);/g, 'const [avatar, setAvatar] = useState("");\n  const [gallery, setGallery] = useState<string[]>([]);');
}

fs.writeFileSync(filePath, content);
