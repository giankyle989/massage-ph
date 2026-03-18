'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export function ImageUploader({ images, onChange, error }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError('Only JPEG, PNG, and WebP images are accepted.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setUploadError('File exceeds 5MB limit.');
        return;
      }

      setUploadError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const json = await res.json();

        if (!res.ok) {
          setUploadError(json.error || 'Upload failed');
          return;
        }

        onChange([...images, json.data.url]);
      } catch {
        setUploadError('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [images, onChange]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Images</h3>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <p className="text-sm text-gray-600">
          {uploading ? 'Uploading...' : 'Drag & drop images here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP up to 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {uploadError && (
        <p className="text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      )}

      {images.length === 0 && error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((url, index) => (
            <div key={url} className="group relative">
              <Image
                src={url}
                alt={`Listing image ${index + 1}`}
                width={200}
                height={112}
                className="h-28 w-full rounded-lg object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
