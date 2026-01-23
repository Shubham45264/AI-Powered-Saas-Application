"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary';

function VideoUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Handle successful upload from Cloudinary Widget
  const handleUploadSuccess = async (result: any) => {
    if (!result || !result.info) return;

    try {
      setIsUploading(true);
      const { public_id, bytes, duration, secure_url } = result.info;

      // Send metadata to our backend to save in DB
      await axios.post("/api/video-upload", {
        title,
        description,
        publicId: public_id,
        originalSize: bytes.toString(),
        duration: duration,
        url: secure_url
      });

      router.push("/home");
    } catch (error: any) {
      console.error("Upload Save Error:", error);
      const errorMsg = error.response?.data?.error || "Failed to save video metadata";
      const details = error.response?.data?.received ? JSON.stringify(error.response.data.received) : "";
      alert(`${errorMsg} ${details}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter video title"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Enter video description"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Upload Video</span>
          </label>
          {/* Cloudinary Upload Widget */}
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "video-upload"}
            options={{
              sources: ['local', 'google_drive', 'dropbox'],
              resourceType: 'video',
              clientAllowedFormats: ['mp4', 'mov', 'avi'],
              maxFileSize: 70 * 1024 * 1024,
            }}
            onSuccess={(result, { widget }) => {
              console.log("Widget Success:", result);
              handleUploadSuccess(result);
            }}
            onError={(err) => {
              console.error("Widget Error:", err);
              // @ts-ignore
              const errorMsg = err?.statusText || err?.message || "Unknown Error";
              alert("Upload failed via widget: " + errorMsg);
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <button
                  onClick={() => {
                    if (!title) {
                      alert("Please enter a title first");
                      return;
                    }
                    open();
                  }}
                  className="btn btn-primary w-full max-w-xs"
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Select Video & Upload"}
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
