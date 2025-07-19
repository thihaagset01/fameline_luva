import React, { useState, useEffect } from 'react';
import { Download, Star } from 'lucide-react';
import { FormData } from '@/types';
import { recommendationEngine } from '@/engine/recommendationEngine';

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

// Props interface for the RecommendationStep component
interface RecommendationStepProps {
  formData: FormData;
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
  // Add null checks to prevent errors
  const acoustic = louver?.model ? (louver.model.startsWith('AC-') ? 'acoustic ' : '') : '';
  const orientation = louver?.frontBlade?.toLowerCase() || 'standard';
  const mullion = formData?.mullionVisibility === 'hidden' ? 'hidden mullion ' : '';
  const louverType = louver?.type?.toLowerCase() || 'standard';
  const purpose = formData?.purpose || 'general';
  const environment = formData?.environment || 'standard';
  
  return `This ${acoustic}louver features ${orientation} blades in a ${louverType} bank configuration with ${mullion}design. Optimized for ${purpose} applications in ${environment} environments.`;
}

// Function removed as it's no longer needed with global CSS classes

// Loading component
const LoadingState: React.FC = () => (
  <div className="recommendations-step">
    <div className="content-card text-center">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse"></div>
      </div>
      <h2 className="recommendations-title">Analyzing Your Requirements</h2>
      <p className="recommendations-description">Our AI is processing your inputs and matching the optimal louver...</p>
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
  <div className="recommendations-step">
    <div className="recommendations-error">
      <div className="error-icon-container">
        <div className="error-icon">⚠</div>
      </div>
      <h2 className="recommendations-title">Recommendation Error</h2>
      <p className="recommendations-description">{error}</p>
      <button 
        onClick={onRetry}
        className="recommendations-button"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Main component
export const RecommendationStep: React.FC<RecommendationStepProps> = ({ formData }) => {
  
  const [recommendation, setRecommendation] = useState<EnhancedLouverRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModelIndex, setActiveModelIndex] = useState(0); // Track which model is active (0 = primary, 1 = first alt, 2 = second alt)
  const [allModels, setAllModels] = useState<EnhancedLouverRecommendation[]>([]);

  // Track previous formData to avoid unnecessary rerenders
  const prevFormDataRef = React.useRef<FormData | null>(null);
  
  // Function to fetch recommendation data
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      // Reset active model index when fetching new data
      setActiveModelIndex(0);
      
      // Use the recommendationEngine directly without getInstance
      const result = await recommendationEngine.getRecommendation(formData);
      const enhancedResult = result as unknown as EnhancedLouverRecommendation;
      setRecommendation(enhancedResult);
      
      // Prepare all models array with primary recommendation and alternatives
      const models = [enhancedResult];
      if (result.alternatives && result.alternatives.length > 0) {
        // Create enhanced alternatives with the same structure as the main recommendation
        const enhancedAlternatives = result.alternatives.map((alt: any) => {
          return {
            ...enhancedResult,
            louver: alt,
            model: alt.model,
            type: alt.type,
            confidenceScore: enhancedResult.confidenceScore * 0.9, // Slightly lower confidence for alternatives
          } as EnhancedLouverRecommendation;
        });
        models.push(...enhancedAlternatives);
      }
      setAllModels(models);
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if formData has changed
    const formDataChanged = JSON.stringify(formData) !== JSON.stringify(prevFormDataRef.current);
    
    // Only fetch if formData has changed or this is the initial mount
    if (formDataChanged) {
      prevFormDataRef.current = {...formData};
      fetchRecommendation();
    }
  }, [formData]); // Depend on formData changes
  
  // Function to handle model selection
  const handleModelSelect = (index: number) => {
    if (index >= 0 && index < allModels.length) {
      setActiveModelIndex(index);
      setRecommendation(allModels[index]);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => {
      setLoading(true);
      setError(null);
      // Re-fetch recommendation
      recommendationEngine.getRecommendation(formData)
        .then(result => {
          setRecommendation(result as unknown as EnhancedLouverRecommendation);
        })
        .catch(err => {
          console.error('Error getting recommendation:', err);
          setError('Failed to get recommendation. Please try again.');
        })
        .finally(() => setLoading(false));
    }} />;
  }

  if (!recommendation) {
    return <LoadingState />;
  }
  
  // Main recommendation display
  return (
    <div className="recommendations-step">
      <div className="recommendations-content">
        {/* Two-column layout for better space utilization */}
        <div className="recommendations-grid">
          {/* Left column: Information */}
          <div className="recommendations-info-column">
            {/* Recommendation header */}
            <div className="recommendations-info">
              <div className="recommendation-header">
                <span className="confidence-badge">
                  {!isNaN(recommendation.confidenceScore) ? Math.round(recommendation.confidenceScore * 100) : '--'}% Match
                </span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.round(recommendation.confidence * 5) ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
              </div>
              <h1 className="recommendations-title">{recommendation.model || recommendation.louver?.model}</h1>
              <p className="recommendations-description">
                {getLouverTypeDescription(recommendation)}
              </p>
              <p className="recommendations-description">
                {getDetailedDescription(recommendation, formData)}
              </p>
            </div>

            {/* Specs grid section */}
            <div className="recommendations-specs">
              <div className="spec-item">
                <div className="spec-label">Airflow</div>
                <div className="spec-value">
                  <span>{!isNaN(recommendation.airflowRating) && recommendation.airflowRating !== undefined ? recommendation.airflowRating : '-'}</span>
                  <span className="spec-unit">/10</span>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Water Resistance</div>
                <div className="spec-value">
                  <span>{!isNaN(recommendation.waterResistanceRating) && recommendation.waterResistanceRating !== undefined ? recommendation.waterResistanceRating : '-'}</span>
                  <span className="spec-unit">/10</span>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Durability</div>
                <div className="spec-value">
                  <span>{!isNaN(recommendation.durabilityRating) && recommendation.durabilityRating !== undefined ? recommendation.durabilityRating : '-'}</span>
                  <span className="spec-unit">/10</span>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Aesthetics</div>
                <div className="spec-value">
                  <span>{!isNaN(recommendation.aestheticsRating) && recommendation.aestheticsRating !== undefined ? recommendation.aestheticsRating : '-'}</span>
                  <span className="spec-unit">/10</span>
                </div>
              </div>
            </div>

            {/* Detailed description */}
            <div className="reason-section">
              <h3 className="reason-title">Why This Louver</h3>
              <ul className="reason-list">
                {recommendation.matchReasons && recommendation.matchReasons.map((reason, index) => (
                  <li key={index} className="reason-item">
                    <span className="reason-bullet">•</span>
                    <span className="reason-text">{reason.explanation || reason.category}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download section */}
            <div className="download-section">
              <div className="download-content">
                <div className="download-info">
                  <h3 className="download-title">Download Specification</h3>
                  <p className="download-description">Get the complete technical details</p>
                </div>
                <button className="recommendations-button">
                  <Download size={20} />
                </button>
              </div>  
            </div>
          </div>

          {/* Right column: Visualization */}
          <div className="recommendations-visual-column">
            {/* Louver visualization */}
            <div className="recommendations-visualization">
              <div className="louver-3d-container">
                {/* Primary panel */}
                <div 
                  className={`louver-3d-panel primary ${activeModelIndex === 0 ? 'active' : ''}`}
                  onClick={() => handleModelSelect(0)}
                  title="Primary recommendation"
                >
                  {/* Model badge */}
                  <div className="louver-model-badge">
                    <div className="louver-model-name">{allModels[0]?.model || recommendation.model}</div>
                    <div className="louver-model-type">{allModels[0]?.type || recommendation.type} Bank</div>
                  </div>
                  {activeModelIndex === 0 && <div className="active-model-indicator">Current Selection</div>}
                </div>

                {/* Alternative options */}
                {allModels.length > 1 && allModels.slice(1, 3).map((altModel, index) => (
                  <div 
                    key={index} 
                    className={`louver-3d-panel ${index === 0 ? 'secondary' : 'tertiary'} ${activeModelIndex === index + 1 ? 'active' : ''}`}
                    onClick={() => handleModelSelect(index + 1)}
                    title={`View ${altModel.model} details`}
                  >
                    <div className="louver-model-badge">
                      <div className="louver-model-name">{altModel.model}</div>
                      <div className="louver-model-type">{altModel.type} Bank</div>
                    </div>
                    {activeModelIndex === index + 1 && <div className="active-model-indicator">Current Selection</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
