import React, { useState, useEffect } from 'react';
import { Download, Star, TrendingUp } from 'lucide-react';
import { FormData } from '@/types';
import { recommendationEngine } from '@/engine/recommendationEngine';
import { NavigationButton } from '@/components/NavigationButton';

// Define a custom recommendation interface that matches our application needs
interface EnhancedLouverRecommendation {
  louver: {
    id: string;
    model: string;
    type: string;
    frontBlade?: string;
    rainDefenseRating?: string;
    airflowCoefficient?: number;
  };
  model: string;
  type: string;
  frontBlade?: string;
  confidence: number;
  confidenceScore: number;
  airflowRating: number;
  waterResistanceRating: number;
  durabilityRating: number;
  aestheticsRating: number;
  matchReasons: { category: string; score: number; explanation: string; weight: number; }[];
  alternatives?: {
    id: string;
    model: string;
    type: string;
    rainDefenseRating: number;
    airflowCoefficient: number;
  }[];
}

interface RecommendationStepProps {
  formData: FormData;
  onPrevStep: () => void;
  onNextStep: () => void;
}

// Helper functions
function getLouverTypeDescription(louver: any): string {
  const typeMap = {
    'Single': 'Single Bank Louver',
    'Double': 'Double Bank Louver', 
    'Triple': 'Triple Bank Louver'
  };
  return typeMap[louver.type as keyof typeof typeMap] || 'Performance Louver';
}

function getDetailedDescription(louver: any, formData: FormData): string {
  const acoustic = louver.model.startsWith('AC-') ? 'acoustic ' : '';
  const orientation = louver.frontBlade?.toLowerCase() || 'standard';
  const mullion = formData.mullionVisibility === 'hidden' ? 'hidden mullion ' : '';
  
  return `This ${acoustic}louver features ${orientation} blades in a ${louver.type.toLowerCase()} bank configuration with ${mullion}design. Optimized for ${formData.purpose} applications in ${formData.environment} environments.`;
}

function getLouverColor(model: string): string {
  const colorMap: Record<string, string> = {
    'PL-1050': '#ef4444', 'PL-2050': '#ef4444', 'PL-3050': '#ef4444',
    'PL-1075': '#f97316', 'PL-2075': '#f97316', 'PL-3075': '#f97316', 
    'PL-2170': '#eab308', 'PL-2150V': '#22c55e',
    'PL-2250': '#06b6d4', 'PL-2250V': '#3b82f6',
    'AC-150': '#8b5cf6', 'AC-300': '#ec4899'
  };
  return colorMap[model] || '#10b981';
}

function adjustLouverColor(model: string): string {
  const base = getLouverColor(model);
  // Darken the color for gradient effect
  const num = parseInt(base.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 40);
  const g = Math.max(0, ((num >> 8) & 0x00FF) - 40);
  const b = Math.max(0, (num & 0x0000FF) - 40);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Loading component
const LoadingState: React.FC = () => (
  <div className="app-container">
    <div className="content-card text-center">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse orb-glow"></div>
      </div>
      <h2 className="text-3xl font-light text-white mb-4">Analyzing Your Requirements</h2>
      <p className="text-white/70 text-lg mb-8">Our AI is processing your inputs and matching the optimal louver...</p>
      <div className="flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Error component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="app-container">
    <div className="content-card text-center">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
          <span className="text-red-400 text-4xl">⚠</span>
        </div>
      </div>
      <h2 className="text-3xl font-light text-white mb-4">Recommendation Error</h2>
      <p className="text-white/70 text-lg mb-8">{error}</p>
      <button 
        onClick={onRetry}
        className="btn-emerald px-8 py-3 rounded-full text-lg font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Main component
export const RecommendationStep: React.FC<RecommendationStepProps> = ({ formData, onPrevStep, onNextStep }) => {
  const [recommendation, setRecommendation] = useState<EnhancedLouverRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateRecommendation();
  }, []);

  const generateRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate AI processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Cast the result to our enhanced type to satisfy TypeScript
      const result = await recommendationEngine.getRecommendation(formData);
      setRecommendation(result as unknown as EnhancedLouverRecommendation);
    } catch (err) {
      setError('Failed to generate recommendation. Please try again.');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={generateRecommendation} />;
  }

  if (!recommendation) {
    return <ErrorState error="No recommendation available" onRetry={generateRecommendation} />;
  }
  
  // Main recommendation display
  return (
    <div className="app-container">
      <div className="content-card">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-full mr-4 flex items-center justify-center" 
                style={{
                  background: `linear-gradient(135deg, ${getLouverColor(recommendation.model)}, ${adjustLouverColor(recommendation.model)})`
                }}
              >
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white">{recommendation.model}</h2>
                <p className="text-white/70">{getLouverTypeDescription(recommendation)}</p>
              </div>
            </div>
            <div className="bg-emerald-500/20 px-4 py-1 rounded-full">
              <span className="text-emerald-400 font-medium">{recommendation.confidenceScore}% Match</span>
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="mb-8">
          <p className="text-white/80 mb-4">{getDetailedDescription(recommendation, formData)}</p>
          
          {/* Performance metrics */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-medium text-white mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded">
                <div className="flex items-center mb-1">
                  <TrendingUp size={16} className="text-emerald-400 mr-2" />
                  <span className="text-white/80 text-sm">Airflow</span>
                </div>
                <div className="text-lg font-medium text-white">{recommendation.airflowRating}/10</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="flex items-center mb-1">
                  <TrendingUp size={16} className="text-emerald-400 mr-2" />
                  <span className="text-white/80 text-sm">Water Resistance</span>
                </div>
                <div className="text-lg font-medium text-white">{recommendation.waterResistanceRating}/10</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="flex items-center mb-1">
                  <TrendingUp size={16} className="text-emerald-400 mr-2" />
                  <span className="text-white/80 text-sm">Durability</span>
                </div>
                <div className="text-lg font-medium text-white">{recommendation.durabilityRating}/10</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="flex items-center mb-1">
                  <TrendingUp size={16} className="text-emerald-400 mr-2" />
                  <span className="text-white/80 text-sm">Aesthetics</span>
                </div>
                <div className="text-lg font-medium text-white">{recommendation.aestheticsRating}/10</div>
              </div>
            </div>
          </div>
          
          {/* Match reasons */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-medium text-white mb-3">Why This Matches Your Needs</h3>
            <ul className="space-y-2">
              {recommendation.matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-emerald-400 mr-2">•</span>
                  <span className="text-white/80">{reason.explanation || reason.category}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Louver visualization */}
        <div className="relative mb-8">
          {/* Main louver visualization */}
          <div 
            className="w-full h-64 md:h-80 rounded-xl relative overflow-hidden shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${getLouverColor(recommendation.model)}, ${adjustLouverColor(recommendation.model)})`
            }}
          >
            {/* Louver blade pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-white/10"
                  style={{
                    transform: `translateY(${i * 40}px) rotate(${recommendation.frontBlade === 'Horizontal' ? 0 : -45}deg)`,
                    marginTop: i * 8
                  }}
                />
              ))}
            </div>

            {/* Model badge */}
            <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-white font-medium">{recommendation.model}</div>
              <div className="text-white/70 text-sm">{recommendation.type} Bank</div>
            </div>
          </div>

          {/* Alternative options */}
          {recommendation.alternatives && recommendation.alternatives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white text-lg font-medium mb-3">Alternative Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recommendation.alternatives.slice(0, 3).map((alternative, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${getLouverColor(alternative.model)}, ${adjustLouverColor(alternative.model)})`
                    }}
                  >
                    <div className="p-3">
                      <div className="text-white font-medium text-sm">{alternative.model}</div>
                      <div className="text-white/70 text-xs">{alternative.type} Bank</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download section */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-white mb-1">Download Specification</h3>
              <p className="text-white/70 text-sm">Get the complete technical details</p>
            </div>
            <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 p-3 rounded-full transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <NavigationButton 
            onClick={onPrevStep} 
            direction="prev" 
          />
          <div className="text-center">
            <p className="text-white/50 text-sm">
              Step 5 of 6 • AI Recommendation
            </p>
          </div>
          <NavigationButton 
            onClick={onNextStep} 
            direction="next" 
          />
        </div>
      </div>
    </div>
  );
};
