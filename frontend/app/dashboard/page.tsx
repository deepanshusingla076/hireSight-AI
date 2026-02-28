'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UploadCard from '@/components/UploadCard';
import { FileText, Zap, Target, Brain } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      // Store file in session storage (for demo purposes)
      const reader = new FileReader();
      reader.onload = (e) => {
        sessionStorage.setItem('uploadedFileName', selectedFile.name);
        router.push('/upload');
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Your AI Dashboard</span>
            </h1>
            <p className="text-xl text-gray-400">
              Upload your resume and get instant AI-powered insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Section */}
            <div>
              <UploadCard onFileSelect={handleFileSelect} isLoading={isLoading} />
              
              {selectedFile && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Analysis'}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">What happens next?</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">PDF Parsing</h3>
                      <p className="text-gray-400 text-sm">
                        We extract all text content from your resume using advanced OCR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Zap className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Skill Extraction</h3>
                      <p className="text-gray-400 text-sm">
                        AI identifies 250+ technical and soft skills from your resume
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Target className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Job Matching</h3>
                      <p className="text-gray-400 text-sm">
                        Compare your skills against job requirements for perfect matches
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">AI Insights</h3>
                      <p className="text-gray-400 text-sm">
                        Google Gemini AI provides personalized recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-2">💡 Pro Tip</h3>
                <p className="text-gray-300 text-sm">
                  For best results, ensure your resume includes specific skills, work experience,
                  and accomplishments. Our AI works best with well-structured resumes!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Average Match Score', value: '78%', color: 'text-green-400' },
              { label: 'Skills Identified', value: '250+', color: 'text-blue-400' },
              { label: 'AI Accuracy', value: '95%', color: 'text-purple-400' },
              { label: 'Processing Time', value: '<5s', color: 'text-pink-400' },
            ].map((stat, index) => (
              <div key={index} className="glass-strong rounded-xl p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
