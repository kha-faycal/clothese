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
          folder: "categories", 
          resource_type: "auto", 
          timeout: 120000,
          // 🚀 إضافة إعدادات الضغط والتحويل التلقائي إلى صيغة WebP الخفيفة جداً
          format: "webp", 
          transformation: [
            { quality: "auto" },  // ضغط ذكي بدون خسارة الجودة المرئية
            { width: 1000, height: 1000, crop: "limit" } // منع رفع صور ضخمة لحفظ مساحة حسابك
          ]
        },
        (error, result) => {
          if (error) {
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
