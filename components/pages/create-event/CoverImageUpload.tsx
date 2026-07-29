"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface CoverImageUploadProps {
  initialPreview?: string | null;
}

export default function CoverImageUpload({ initialPreview }: CoverImageUploadProps) {
  const { setValue, formState: { errors } } = useFormContext();
  const [coverPreview, setCoverPreview] = useState<string | null>(initialPreview || null);
  const coverUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialPreview) {
      setCoverPreview(initialPreview);
    }
  }, [initialPreview]);

  useEffect(() => {
    return () => {
      if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current);
    };
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current);
    const url = file ? URL.createObjectURL(file) : null;
    coverUrlRef.current = url;
    setCoverPreview(url);
    setValue("coverImage", file, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="group relative flex aspect-4/5 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-6 text-center shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-black/30">
        <input
          type="file"
          name="cover"
          accept="image/*"
          onChange={handleCoverChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        {coverPreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreview}
              alt="Event cover preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <span className="text-sm font-medium text-white">Change cover</span>
            </div>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-9 w-9 text-black/40"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.5-4.5a2 2 0 012.8 0L15 16.5m-2-2l1.5-1.5a2 2 0 012.8 0L21 15M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="mt-4 text-sm font-medium text-black/70">Add event cover</span>
            <span className="mt-1 text-xs text-black/40">PNG, JPG, or WEBP · 4:5 looks best</span>
          </>
        )}
      </div>
      {errors.coverImage && (
        <span className="text-red-500 text-xs mt-1">
          {errors.coverImage.message as string}
        </span>
      )}
    </div>
  );
}
