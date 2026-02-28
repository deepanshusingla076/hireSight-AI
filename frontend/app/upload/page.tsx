'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UploadCard from '@/components/UploadCard';
import { analyzeResume } from '@/lib/api';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume first');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeResume(selectedFile, jobDescription);

      if (result.success) {
        // Store results in session storage
        sessionStorage.setItem('analysisResult', JSON.stringify(result.data));
        router.push('/results');
      } else {
        setError(result.message || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Resume Analysis</span>
            </h1>
            <p className="text-xl text-gray-400">
              Upload your resume and paste the job description
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <UploadCard onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>

          {/* Job Description */}
          <div className="glass-strong rounded-2xl p-8 mb-8">
            <label className="block mb-4">
              <span className="text-lg font-semibold text-white mb-2 block">
                Job Description *
              </span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... Include requirements, responsibilities, and preferred qualifications."
                className="w-full h-48 px-4 py-3 bg-black/30 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                disabled={isLoading}
              />
            </label>
            <p className="text-sm text-gray-400">
              💡 Tip: Include skills, requirements, and qualifications for better matching
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 flex items-center space-x-3 text-red-400 bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/30">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !selectedFile || !jobDescription.trim()}
              className="inline-flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              <span>{isLoading ? 'Analyzing...' : 'Analyze Resume'}</span>
            </button>
            
            {isLoading && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 mb-2">This may take 10-20 seconds...</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Parsing PDF</span>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
                  <span>Extracting Skills</span>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
                  <span>AI Analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
