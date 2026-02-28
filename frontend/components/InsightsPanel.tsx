'use client';

import { Lightbulb, CheckCircle, XCircle, TrendingUp, BookOpen } from 'lucide-react';

interface InsightsPanelProps {
  strengths?: string[];
  improvements?: string[];
  recommendations?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
}

export default function InsightsPanel({
  strengths = [],
  improvements = [],
  recommendations = [],
  matchedSkills = [],
  missingSkills = [],
}: InsightsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-bold text-white">Key Strengths</h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {improvements.length > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span className="text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-primary/20">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-gray-300">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-bold text-white">Matched Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="glass-strong rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-bold text-white">Skills to Develop</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
