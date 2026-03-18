import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import {
  processDistribuidorImageUploads,
  validateDistribuidorUploadFiles,
} from "@/lib/modules/distribuidor/image-upload";
import { requireDistribuidorAccess } from '@/lib/security/distribuidor-auth';

export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/distribuidor/upload-imagens
// Upload em massa de imagens com vinculação automática por código Mercos
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const distribuidorId = formData.get("distribuidor_id") as string;
    
    const authError = await requireDistribuidorAccess(req, distribuidorId);
    if (authError) return authError;

    const validation = validateDistribuidorUploadFiles(files);
    if (!validation.ok) {
      return NextResponse.json(validation.body, { status: validation.status });
    }

    const payload = await processDistribuidorImageUploads({ distribuidorId, files });
    return NextResponse.json(payload);
  } catch (error: any) {
    logger.error("Erro no upload em massa:", error);
    return NextResponse.json(
      { error: "Erro ao processar upload", details: error.message },
      { status: 500 }
    );
  }
}
