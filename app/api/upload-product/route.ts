import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Use getAll() instead of get() to fetch every file uploaded at once
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Process all images concurrently in parallel for performance optimization
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

    // Return the array of full URLs back to your variant component state
    return NextResponse.json({ urls: secureUrls });
  } catch (err: any) {
    console.error("Catch handler triggered on product media stream:", err);
    return NextResponse.json(
      { error: err.message || "Échec de l'envoi groupé vers Cloudinary" }, 
      { status: 500 }
    );
  }
}
