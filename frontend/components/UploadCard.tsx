'use client';

import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function UploadCard({ onFileSelect, isLoading }: UploadCardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError('');
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold gradient-text mb-2">Upload Your Resume</h2>
        <p className="text-gray-400">Drop your PDF resume or click to browse</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-600 hover:border-primary/50'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center space-y-4">
          {selectedFile ? (
            <>
              <FileCheck className="h-16 w-16 text-green-500" />
              <p className="text-lg font-semibold text-white">{selectedFile.name}</p>
              <p className="text-sm text-gray-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </>
          ) : (
            <>
              <Upload className="h-16 w-16 text-primary" />
              <p className="text-lg font-semibold text-white">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-gray-400">or</p>
            </>
          )}

          <button
            onClick={onButtonClick}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : selectedFile ? 'Change File' : 'Browse Files'}
          </button>

          <p className="text-xs text-gray-500">PDF only • Max 5MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
