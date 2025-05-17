"use client";

import { UploadButton } from "../../utilis/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-6">
      {/* Image Upload */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Upload Image</h2>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Image Files: ", res);
            alert("Image Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`Image Upload Error: ${error.message}`);
          }}
        />
      </div>

      {/* PDF Upload */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Upload PDF</h2>
        <UploadButton
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => {
            console.log("PDF Files: ", res);
            alert("PDF Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`PDF Upload Error: ${error.message}`);
          }}
        />
      </div>
    </main>
  );
}
