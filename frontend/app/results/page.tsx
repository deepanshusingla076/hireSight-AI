'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ScoreCard from '@/components/ScoreCard';
import InsightsPanel from '@/components/InsightsPanel';
import { 
  Download, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  FileText,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisData {
  resumeText?: string;
  extractedSkills?: string[];
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  aiInsights?: {
    fitScore: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
  questions?: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    // Retrieve analysis results from session storage
    const storedData = sessionStorage.getItem('analysisResult');
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData));
      } catch (err) {
        console.error('Failed to parse analysis data:', err);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  if (!analysisData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading results...</p>
        </div>
      </main>
    );
  }

  const matchScore = analysisData.matchScore || 0;
  const fitScore = analysisData.aiInsights?.fitScore || 0;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>New Analysis</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button className="p-3 glass-strong rounded-lg hover:bg-white/10 transition-colors">
                <Download className="h-5 w-5 text-gray-300" />
              </button>
              <button className="p-3 glass-strong rounded-lg hover:bg-white/10 transition-colors">
                <Share2 className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Analysis Results</span>
            </h1>
            <p className="text-xl text-gray-400">
              Here's how your resume matches the job requirements
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ScoreCard
              title="Resume Match Score"
              score={matchScore}
              icon="target"
              color="primary"
            />
            <ScoreCard
              title="AI Fit Score"
              score={fitScore}
              icon="award"
              color="secondary"
            />
            <ScoreCard
              title="Overall Rating"
              score={Math.round((matchScore + fitScore) / 2)}
              icon="trending"
              color="accent"
            />
          </div>

          {/* Skills Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Extracted Skills */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Extracted Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisData.extractedSkills?.slice(0, 20).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {(analysisData.extractedSkills?.length || 0) > 20 && (
                  <span className="px-3 py-1 text-gray-400 text-sm">
                    +{(analysisData.extractedSkills?.length || 0) - 20} more
                  </span>
                )}
              </div>
            </div>

            {/* Resume Summary */}
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold text-white">Quick Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Matched Skills</span>
                  <span className="text-green-400 font-semibold">
                    {analysisData.matchedSkills?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Missing Skills</span>
                  <span className="text-red-400 font-semibold">
                    {analysisData.missingSkills?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Skills Found</span>
                  <span className="text-primary font-semibold">
                    {analysisData.extractedSkills?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Resume Length</span>
                  <span className="text-accent font-semibold">
                    {analysisData.resumeText ? `${Math.round(analysisData.resumeText.length / 500)} pages` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {analysisData.aiInsights && (
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-white">AI-Powered Insights</h2>
              </div>
              
              <InsightsPanel
                strengths={analysisData.aiInsights.strengths}
                improvements={analysisData.aiInsights.areasForImprovement}
                recommendations={analysisData.aiInsights.recommendations}
                matchedSkills={analysisData.matchedSkills}
                missingSkills={analysisData.missingSkills}
              />
            </div>
          )}

          {/* Interview Questions (if available) */}
          {analysisData.questions && analysisData.questions.length > 0 && (
            <div className="glass-strong rounded-2xl p-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-bold text-white">Interview Questions</h2>
                </div>
                <button
                  onClick={() => setShowQuestions(!showQuestions)}
                  className="px-4 py-2 glass rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {showQuestions ? 'Hide' : 'Show'} Questions
                </button>
              </div>

              {showQuestions && (
                <div className="space-y-4">
                  {analysisData.questions.map((question, index) => (
                    <div
                      key={index}
                      className="p-4 bg-black/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-300 flex-1">{question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Analyze Another Resume</span>
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 px-8 py-4 glass-strong rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
