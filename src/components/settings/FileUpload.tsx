import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FileUploadProps {
  label: string;
  description?: string;
  currentFile?: string;
  onFileChange: (file: File | null, dataUrl: string | null) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export default function FileUpload({
  label,
  description,
  currentFile,
  onFileChange,
  accept = "image/*",
  maxSize = 5
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onFileChange(null, null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onFileChange(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setPreview(null);
    onFileChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {preview ? (
        <div className="relative inline-block">
          <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeFile}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-500">
            Max size: {maxSize}MB. Supports: JPG, PNG, GIF
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
}