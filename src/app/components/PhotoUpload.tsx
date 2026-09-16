"use client";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useEffect, useState } from "react";

interface PhotoUploadProps {
  maxFiles?: number;
  onChange: (urls: string[]) => void;
}

export default function PhotoUpload({
  maxFiles = 3,
  onChange,
}: PhotoUploadProps) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    onChange(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls]);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info;
    const newUrl =
      info && typeof info === "object" && "secure_url" in info
        ? (info.secure_url as string)
        : undefined;
    if (!newUrl) return;
    setUrls((prev) => {
      if (prev.length >= maxFiles) return prev;
      return [...prev, newUrl];
    });
  };

  const removeUrl = (url: string) => {
    setUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {urls.map((url) => (
          <div key={url} className="relative h-24 w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Uploaded photo"
              className="h-24 w-24 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => removeUrl(url)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {urls.length < maxFiles && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: maxFiles - urls.length,
            sources: ["local", "camera"],
          }}
          onSuccess={handleSuccess}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="rounded-lg border border-dashed border-gray-400 px-4 py-2 text-sm text-gray-600 hover:border-gray-600"
            >
              + Add photo ({urls.length}/{maxFiles})
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
