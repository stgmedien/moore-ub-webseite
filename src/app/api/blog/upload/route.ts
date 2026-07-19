import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Token-Endpoint für Client-Uploads zu Vercel Blob.
 *
 * Der Browser lädt Bilder DIREKT zum Blob-Store hoch (Client-Upload-Muster)
 * und umgeht damit das 4,5-MB-Body-Limit der Vercel-Functions, an dem
 * Server-Action-Uploads mit typischen Fotos scheitern. Diese Route prüft
 * nur die Berechtigung und stellt ein kurzlebiges Upload-Token aus.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "manager" && role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ALLOWED_MIME,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ pathname }),
      }),
      // Läuft nur bei öffentlich erreichbaren Deployments (nicht auf localhost) —
      // wir brauchen den Callback nicht, die Client-Seite erhält die URL direkt.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload fehlgeschlagen." },
      { status: 400 }
    );
  }
}
