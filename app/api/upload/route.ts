import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier uploadé" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "categories", // Fixed typo 'categorys' to standard english
          resource_type: "auto", 
           timeout: 120000,
        },
        (error, result) => {
          if (error) {
            // This logs the precise Cloudinary API configuration error to your terminal console
            console.error("❌ Cloudinary Internal Error Details:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err: any) {
    console.error("Cloudinary upload catch block caught:", err);
    return NextResponse.json(
      { error: err.message || "Échec de l'envoi vers Cloudinary" }, 
      { status: 500 }
    );
  }
}
