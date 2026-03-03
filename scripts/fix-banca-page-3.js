const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fixing imports
content = content.replace(/import ImageUploadDragDrop from "@\/components\/admin\/ImageUploadDragDrop";/g, 'import ImageUploadDragDrop from "@/components/admin/ImageUploadDragDrop";\nimport FileUploadDragDrop from "@/components/admin/FileUploadDragDrop";');
content = content.replace(/import FileUploadDragDrop from "@\/components\/common\/FileUploadDragDrop";\n/g, '');

// Fixing states
content = content.replace(/setAvatarUrl/g, 'setAvatar');
content = content.replace(/avatarUrl/g, 'avatar');
content = content.replace(/setCoverUrl/g, 'setCover');
content = content.replace(/coverUrl/g, 'cover');

// the gallery state doesn't seem to exist in the useState list (avatar, cover exist)
// We need to check if there is a gallery state.
