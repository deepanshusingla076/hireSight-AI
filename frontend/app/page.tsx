import Link from 'next/link';
import { ArrowRight, Brain, Zap, Shield, Target, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-gray-300">Powered by Google Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Resume with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Get instant AI-powered insights, match scoring, and personalized recommendations
            to land your dream job faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Analysis</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#features"
              className="px-8 py-4 glass-strong rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: 'Resumes Analyzed', value: '10K+' },
              { label: 'AI Accuracy', value: '95%' },
              { label: 'Skills Tracked', value: '250+' },
              { label: 'Success Rate', value: '87%' },
            ].map((stat, index) => (
              <div key={index} className="glass-strong rounded-xl p-6">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to optimize your resume</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: 'AI-Powered Analysis',
                description: 'Get intelligent insights powered by Google Gemini AI to understand your resume strengths and weaknesses.',
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: 'Job Match Scoring',
                description: 'See exactly how well your resume matches job requirements with detailed scoring and recommendations.',
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'Instant Results',
                description: 'Upload your resume and get comprehensive analysis in seconds, not hours.',
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Skill Gap Analysis',
                description: 'Identify missing skills and get personalized learning paths to fill the gaps.',
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: 'Interview Questions',
                description: 'AI-generated interview questions tailored to your resume and target job role.',
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: 'Batch Processing',
                description: 'Compare your resume against multiple job listings simultaneously.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-strong rounded-2xl p-8 hover:border-primary/30 border border-transparent transition-all duration-300 group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-gray-400">Simple, fast, and powerful</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Resume',
                description: 'Upload your PDF resume securely. We support files up to 5MB.',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI extracts skills, analyzes content, and matches against job requirements.',
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive detailed scores, recommendations, and actionable insights instantly.',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="glass-strong rounded-2xl p-8 text-center">
                  <div className="text-6xl font-bold gradient-text mb-4">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-animate opacity-20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Optimize Your Resume?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of job seekers who improved their resumes with AI
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">HireSight AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            Powered by Google Gemini AI • Built with Next.js & FastAPI
          </p>
          <p className="text-sm text-gray-500">
            © 2026 HireSight AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
