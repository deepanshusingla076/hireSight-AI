'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Database, 
  RefreshCw, 
  Search, 
  FileText, 
  Briefcase,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getDatasetStats, 
  getRandomJob, 
  searchJobs,
  getCategories,
  type JobDescription,
  type DatasetStats 
} from '@/lib/dataset';
import { checkMLServiceStatus } from '@/lib/api';
import Link from 'next/link';

export default function TestPage() {
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [randomJob, setRandomJob] = useState<JobDescription | null>(null);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load initial data
  useEffect(() => {
    loadStats();
    loadCategories();
    checkStatus();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDatasetStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await checkMLServiceStatus();
      setServiceStatus(response);
    } catch (err: any) {
      setServiceStatus({ success: false, error: 'Service unavailable' });
    }
  };

  const handleGetRandomJob = async () => {
    setLoading(true);
    setError('');
    try {
      const job = await getRandomJob();
      setRandomJob(job);
    } catch (err: any) {
      setError('Failed to load random job');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeywords.trim()) {
      setError('Please enter search keywords');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const keywords = searchKeywords.split(',').map(k => k.trim()).filter(k => k);
      const results = await searchJobs(keywords, 5);
      setSearchResults(results);
    } catch (err: any) {
      setError('Search failed');
    } finally {
      setLoading(false);
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
              <span className="gradient-text">Testing Dashboard</span>
            </h1>
            <p className="text-xl text-gray-400">
              Test the complete integration with real dataset
            </p>
          </div>

          {/* Service Status */}
          <div className="glass-strong rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {serviceStatus?.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">System Status</h3>
                  <p className="text-sm text-gray-400">
                    {serviceStatus?.success ? 'All services operational' : 'Service unavailable'}
                  </p>
                </div>
              </div>
              <button
                onClick={checkStatus}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Dataset Statistics */}
          {stats && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Database className="h-6 w-6 text-primary" />
                <span>Dataset Statistics</span>
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="glass-strong rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stats.total_job_descriptions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Job Descriptions</div>
                </div>
                
                <div className="glass-strong rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {stats.categories}
                  </div>
                  <div className="text-sm text-gray-400">Job Categories</div>
                </div>
                
                <div className="glass-strong rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {Object.values(stats.resumes_by_category).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Sample Resumes</div>
                </div>
                
                <div className="glass-strong rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {stats.total_resume_data > 0 ? stats.total_resume_data.toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">Resume Records</div>
                </div>
              </div>
            </div>
          )}

          {/* Random Job Generator */}
          <div className="glass-strong rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Random Job Generator</span>
              </h2>
              <button
                onClick={handleGetRandomJob}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                <span>Generate</span>
              </button>
            </div>

            {randomJob && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{randomJob.job_title}</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{randomJob.job_description}</p>
                </div>
                <Link
                  href={`/upload?job_title=${encodeURIComponent(randomJob.job_title)}&job_desc=${encodeURIComponent(randomJob.job_description)}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze Resume Against This Job</span>
                </Link>
              </div>
            )}
          </div>

          {/* Job Search */}
          <div className="glass-strong rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <Search className="h-6 w-6 text-primary" />
              <span>Search Job Descriptions</span>
            </h2>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                placeholder="Enter keywords (e.g., python, developer, engineer)"
                className="flex-1 px-4 py-3 bg-black/30 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </button>
            </div>

            {searchResults && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">
                  Found {searchResults.data.count} results
                </p>
                {searchResults.data.jobs.map((job: JobDescription, index: number) => (
                  <div key={index} className="p-4 bg-black/30 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-bold text-white mb-2">{job.job_title}</h4>
                    <p className="text-gray-300 text-sm line-clamp-3">{job.job_description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Categories */}
          {categories.length > 0 && (
            <div className="glass-strong rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <FileText className="h-6 w-6 text-primary" />
                <span>Available Resume Categories</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm text-center hover:bg-primary/20 transition-colors cursor-default"
                  >
                    {category}
                  </div>
                ))}
              </div>
              
              {stats && (
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Total sample resumes across all categories: {' '}
                    <span className="text-primary font-semibold">
                      {Object.values(stats.resumes_by_category).reduce((a, b) => a + b, 0)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 flex items-center space-x-3 text-red-400 bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/30">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-white mb-6">Ready to Test?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                Upload Resume & Analyze
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 glass-strong rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
