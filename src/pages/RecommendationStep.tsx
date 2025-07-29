import * as React from 'react';
import { useState, useEffect } from 'react';
import './styles/RecommendationStep.css';
import { Download, Star } from 'lucide-react';
import { FormData } from '@/types';
import { recommendationEngine } from '@/engine/recommendationEngine';

/**
 * Comprehensive interface for louver recommendations 📋
 * 
 * This interface defines the structure of louver recommendations returned by the recommendation engine.
 * It includes all the properties needed to display detailed information about recommended louvers
 * including ratings, specs, and alternative options.
 * 
 * The structure mirrors what the recommendation engine returns, with additional fields for UI display.
 * Each recommendation includes both the primary louver and alternative options.
 * 
 * 💡 When working with this interface, you'll mainly be consuming data from the recommendation
 * engine and displaying it in the UI. The engine handles all the complex scoring logic.
 */
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

/**
 * Props for the RecommendationStep component 🧩
 * 
 * The component requires formData which contains all user selections and preferences
 * from previous steps in the wizard. This formData drives the recommendation engine
 * and determines which louver models are suggested to the user.
 * 
 * 🔄 When formData changes (e.g., when the user goes back and changes their selections),
 * the component will automatically fetch new recommendations using useEffect.
 * 
 * @example
 * <RecommendationStep formData={userFormData} />
 */
interface RecommendationStepProps {
  formData: FormData;
}

/**
 * Helper functions for formatting and displaying louver information 🔠
 * 
 * These utility functions transform raw data into user-friendly display text.
 * They handle the conversion of technical terms and codes into more readable
 * descriptions that make sense to end users without technical knowledge.
 * 
 * 🧰 These functions are used throughout the component to ensure consistent
 * formatting and presentation of technical louver information.
 */
function getLouverTypeDescription(louver: any): string {
  const typeMap = {
    'Single': 'Single Bank Louver',
    'Double': 'Double Bank Louver', 
    'Triple': 'Triple Bank Louver'
  };
  return typeMap[louver.type as keyof typeof typeMap] || 'Performance Louver';
}

/**
 * Creates a detailed, human-readable description of a louver model 📝
 * 
 * This function combines various properties from both the louver model and the user's
 * form selections to generate a comprehensive description that highlights the key
 * features and intended application of the louver.
 * 
 * 🛡️ The function includes null/undefined checks to prevent runtime errors when
 * dealing with potentially incomplete data from the API or user inputs.
 * 
 * @param louver - The louver model object with technical specifications
 * @param formData - User selections from previous steps
 * @returns A formatted string describing the louver's features and application
 * @example
 * // Returns something like: "This acoustic louver features horizontal blades in a double bank configuration with hidden mullion design. Optimized for ventilation applications in coastal environments."
 * const description = getDetailedDescription(louverModel, userFormData);
 */
function getDetailedDescription(louver: any, formData: FormData): string {
  // Extract properties with null/undefined checks to prevent runtime errors
  const acoustic = louver?.model ? (louver.model.startsWith('AC-') ? 'acoustic ' : '') : '';
  const orientation = louver?.frontBlade?.toLowerCase() || 'standard';
  const mullion = formData?.mullionVisibility === 'hidden' ? 'hidden mullion ' : '';
  const louverType = louver?.type?.toLowerCase() || 'standard';
  const purpose = formData?.purpose || 'general';
  const environment = formData?.environment || 'standard';
  
  return `This ${acoustic}louver features ${orientation} blades in a ${louverType} bank configuration with ${mullion}design. Optimized for ${purpose} applications in ${environment} environments.`;
}

/**
 * Loading state component ⏳
 * 
 * Displays an animated loading indicator with a friendly message while
 * the recommendation engine processes the user's inputs.
 * 
 * 🎭 The component includes a pulsing circle animation and bouncing dots to indicate
 * that the system is working. This provides visual feedback to users during what
 * might otherwise feel like a delay.
 * 
 * This is a standalone component used within RecommendationStep when
 * recommendations are being fetched from the engine.
 * 
 * @returns JSX element with loading animation and message
 */
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

/**
 * Error state component ⚠️
 * 
 * Displays an error message with a retry button when the recommendation
 * engine encounters an issue fetching recommendations.
 * 
 * 🔄 This component helps users recover from errors without needing to restart
 * the entire wizard process. The retry button allows them to try fetching recommendations
 * again without losing the user's previous selections.
 * 
 * This is a standalone component used within RecommendationStep when
 * an error occurs during recommendation fetching.
 * 
 * @param error - The error message to display
 * @param onRetry - Callback function to retry fetching recommendations
 * @returns JSX element with error message and retry button
 */
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

/**
 * RecommendationStep component 🏆
 * 
 * This is the main component for the recommendation step in the wizard.
 * It fetches and displays louver recommendations based on the user's inputs from previous steps.
 * 
 * 🔄 The component handles three states:
 * 1. Loading - When recommendations are being fetched (shows animated loading indicator)
 * 2. Error - When there's an issue fetching recommendations (shows retry option)
 * 3. Results - When recommendations are successfully loaded (shows interactive UI)
 * 
 * The component automatically fetches new recommendations whenever the formData prop changes,
 * ensuring that users always see recommendations based on their current selections.
 * 
 * 🖱️ Users can interact with the 3D louver panels on the right side to view details
 * for different recommended models. The left side shows detailed information about
 * the currently selected model.
 */
export const RecommendationStep: React.FC<RecommendationStepProps> = ({ formData }) => {
  
  // State variables to store the current recommendation, loading status, error messages, and active model index
  const [recommendation, setRecommendation] = useState<EnhancedLouverRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModelIndex, setActiveModelIndex] = useState(0);  // Tracks which model is currently selected (0 = primary recommendation, 1-2 = alternative options)
  const [allModels, setAllModels] = useState<EnhancedLouverRecommendation[]>([]);

  // Stores previous formData to compare and prevent unnecessary API calls when formData hasn't changed
  const prevFormDataRef = React.useRef<FormData | null>(null);
  
  /**
   * Fetches recommendation data from the recommendation engine 🔍
   * 
   * This function calls the recommendation engine with the current formData,
   * processes the results, and sets up the primary and alternative models for display.
   * 
   * ⚙️ Process flow:
   * 1. Set loading state to true
   * 2. Call the recommendation engine with formData
   * 3. Process the returned data and format it for display
   * 4. Set up the primary and alternative models
   * 5. Update component state with the results
   * 
   * It also handles loading states and error conditions appropriately, ensuring
   * that the UI always reflects the current state of the recommendation process.
   * 
   * The function is called automatically when the component mounts and whenever
   * the formData changes via useEffect.
   * 
   * @private Internal component method
   */
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      // Always reset to the primary recommendation when fetching new data
      setActiveModelIndex(0);
      
      // Call the recommendation engine with the current form data
      const result = await recommendationEngine.getRecommendation(formData);
      const enhancedResult = result as unknown as EnhancedLouverRecommendation;
      setRecommendation(enhancedResult);
      
      // Create an array containing both the primary recommendation and alternatives for the 3D visualization
      const models = [enhancedResult];
      if (result.alternatives && result.alternatives.length > 0) {
        // Format alternative models to match the structure of the primary recommendation
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
    // Compare current and previous formData to determine if we need to fetch new recommendations
    const formDataChanged = JSON.stringify(formData) !== JSON.stringify(prevFormDataRef.current);
    
    // Only fetch new recommendations if the user has changed their inputs
    if (formDataChanged) {
      prevFormDataRef.current = {...formData};
      fetchRecommendation();
    }
  }, [formData]); // Re-run this effect whenever formData changes
  
  /**
   * Handles user selection of different louver models 👆
   * 
   * When a user clicks on one of the 3D louver panels, this function updates the
   * active model and displays its details in the information section.
   * 
   * 🔄 The function performs these actions:
   * 1. Updates the activeModelIndex state to highlight the selected panel
   * 2. Sets the activeModel state to the selected model's data
   * 3. The information panel updates to show details for the selected model
   * 
   * This creates an interactive experience where users can easily compare
   * different louver options by clicking on the visual representations.
   * 
   * @param index - The index of the selected model in the allModels array
   * @private Internal component method
   */
  const handleModelSelect = (index: number) => {
    if (index >= 0 && index < allModels.length) {
      setActiveModelIndex(index);
      setRecommendation(allModels[index]);
    }
  };

    // Note: handleModelSelect is used for all model selection interactions

  // Conditional rendering based on component state
  // The component renders different UI based on three possible states:
  // 1. Loading: Shows a loading animation while fetching recommendations
  // 2. Error: Shows an error message with retry button if fetching fails
  // 3. Success: Shows the full recommendation UI with interactive panels
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => {
      setLoading(true);
      setError(null);
      // Try fetching recommendations again after user clicks retry
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
  
  // Render the main recommendation UI with information and 3D visualization
  return (
    <div className="recommendations-step">
      <div className="recommendations-content">
        {/* Main content organized in a two-column layout for optimal space usage */}
        <div className="recommendations-grid">
          {/* Left column: Detailed information about the selected louver */}
            {/* This column shows specifications, ratings, and explanations for the currently selected model */}
          <div className="recommendations-info-column">
            {/* Header section with confidence score and model name */}
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
                {/* Louver type and description - Shows the louver type and a detailed description */}
                {getLouverTypeDescription(recommendation)}
              </p>
              <p className="recommendations-description">
                {getDetailedDescription(recommendation, formData)}
              </p>
            </div>

            {/* Technical specifications - Shows the louver's key performance metrics */}
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

            {/* Explanation of why this louver was recommended - Shows reasoning behind the recommendation */}
            {/* These reasons are generated by the recommendation engine and explain why this louver is a good match for the user's needs */}
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

            {/* Option to download detailed technical specifications - Allows users to get complete documentation */}
            {/* This feature allows users to download a PDF with complete technical specifications for the selected louver */}
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

          {/* Right column: Interactive 3D louver visualization - Shows 3D panels that users can click to select */}
          {/* This interactive visualization helps users understand the physical differences between louver options */}
          <div className="recommendations-visual-column">
            {/* Interactive 3D louver panel visualization */}
            <div className="recommendations-visualization">
              <div className="louver-3d-container">
                {/* Primary (recommended) louver panel - The best match based on user requirements */}
                <div 
                  className={`louver-3d-panel primary ${activeModelIndex === 0 ? 'active' : ''}`}
                  onClick={() => handleModelSelect(0)}
                  title="Primary recommendation"
                >
                  {/* Model information badge showing model name and type - Helps users identify each panel */}
                  <div className="louver-model-badge">
                    <div className="louver-model-name">{allModels[0]?.model || recommendation.model}</div>
                    <div className="louver-model-type">{allModels[0]?.type || recommendation.type} Bank</div>
                  </div>
                  {activeModelIndex === 0 && <div className="active-model-indicator">Current Selection</div>}
                </div>

                {/* Alternative louver options the user can select - Shows other good matches the user might prefer */}
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
