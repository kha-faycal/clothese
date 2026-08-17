import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // جلب جميع الملفات المرفوعة دفعة واحدة
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // معالجة جميع الصور بالتوازي لضمان سرعة استجابة السيرفر
    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const nodeBuffer = Buffer.from(arrayBuffer);
      
      const readableStream = new Readable();
      readableStream._read = () => {}; 
      readableStream.push(nodeBuffer);
      readableStream.push(null);

      return new Promise<string>((resolve, reject) => {
        const cldStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "auto",
            timeout: 120000,
            // 🚀 الإعدادات السحرية لتحويل وضغط الصور المتعددة تلقائياً
            format: "webp", 
            transformation: [
              { quality: "auto" }, // ضغط ذكي يقلل الحجم دون التأثير على وضوح المنتج
              { width: 1200, height: 1200, crop: "limit" } // حجم ممتاز جداً لعرض تفاصيل المنتجات بدقة عالية وبوزن خفيف
            ]
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary Product Image Upload Error:", error);
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        );
        readableStream.pipe(cldStream);
      });
    });

    const secureUrls = await Promise.all(uploadPromises);

    // إرجاع مصفوفة روابط الصور المحسنة إلى حالة الـ Variant Component
    return NextResponse.json({ urls: secureUrls });
  } catch (err: any) {
    console.error("Catch handler triggered on product media stream:", err);
    return NextResponse.json(
      { error: err.message || "Échec de l'envoi groupé vers Cloudinary" }, 
      { status: 500 }
    );
  }
}
