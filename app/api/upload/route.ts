import dbConnect from '@/dbConnect';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = async (req: Request) => {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or invalid format' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    const uploadResult = await new Promise<{ url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'hotel_rooms' },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url: uploadResult.url });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
};
