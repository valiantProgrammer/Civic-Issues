import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials from environment variables.
// It's crucial that these are set correctly in your deployment environment (e.g., Vercel, Netlify).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This function handles the POST request to /api/upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // 1. Basic Validation: Check if a file was received.
    if (!file) {
      console.error("No file found in form data.");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // The 'File' object from formData needs to be converted to a buffer
    // for Cloudinary's streaming upload API.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload to Cloudinary: We'll use a Promise-based approach to handle the stream.
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // Optional: You can add upload options here.
          // folder: "panoramas", // Example: Upload to a specific folder
          // resource_type: "image", // The resource type is auto-detected by default
        },
        (error, result) => {
          if (error) {
            // If Cloudinary returns an error, reject the promise.
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          // If the upload is successful, resolve the promise with the result.
          resolve(result);
        }
      );

      // Write the buffer to the upload stream.
      uploadStream.end(buffer);
    }); 
    return NextResponse.json({ url: uploadResult.secure_url });

  } catch (error) {
    // 4. Error Handling: If any part of the process fails, log the error
    // and return a generic server error response.
    console.error("An error occurred during the upload process:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
