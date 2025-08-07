import * as React from 'react';
import { useEffect, useState } from 'react';
import './styles/SummaryStep.css';
import { Download, Share2, RotateCcw } from 'lucide-react';
import { FormData, WeatherData } from '@/types';
import { WeatherSummary } from '@/components/WeatherSummary';
import { generatePDFSummary } from '@/utils/pdfGenerator';
import { handleEnhancedShare } from '@/utils/shareHandler';

/**
 * 🎉 SummaryStep Component
 * 
 * This is the final step in our louver selection wizard! It presents a summary
 * of all the user's selections and the AI-generated recommendation.
 * 
 * Key features:
 * - Displays a success message and project summary
 * - Shows weather data if available
 * - Provides options to download or share results
 * - Explains next steps in the process
 * - Allows starting a new project
 * 
 * This component serves as the completion page that confirms the user has
 * successfully completed the louver selection process and what they can
 * expect next.
 */

/**
 * Props for the SummaryStep component
 * 
 * @property formData - All collected user data from previous steps
 * @property onReset - Function to reset the form and start a new project
 * @property recommendedModel - Optional recommended louver model from AI
 */
interface SummaryStepProps {
  formData: FormData;
  onReset: () => void;
  recommendedModel?: string; // Add recommended model prop
}

/**
 * The SummaryStep component implementation
 * 
 * This component is structured in sections:
 * 1. Success message and completion status
 * 2. Project summary card with key details
 * 3. Weather data summary (if available)
 * 4. Action buttons for download and sharing
 * 5. "What's next" process explanation
 * 6. Company information footer
 */
export const SummaryStep: React.FC<SummaryStepProps> = ({ 
  formData, 
  onReset, 
  recommendedModel 
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  /**
   * Parse stored weather data string back to object if available
   * Weather data enhances the recommendation with climate considerations
   */
  const weatherData: WeatherData | null = formData.weatherData 
    ? JSON.parse(formData.weatherData) 
    : null;

  /**
   * Enhanced PDF download handler
   */
  const handleDownloadSummary = async () => {
    setIsDownloading(true);
    
    try {
      console.log('Generating PDF summary with weather data...', formData);
      
      const result = await generatePDFSummary(formData, weatherData, recommendedModel);
      
      if (result.success) {
        // Show success notification
        alert(`PDF "${result.fileName}" downloaded successfully!`);
      } else {
        // Show error notification
        alert(`PDF generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Enhanced share handler with multiple options
   */
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const result = await handleEnhancedShare(formData, weatherData, recommendedModel);
      
      if (result.success) {
        console.log(`Shared via ${result.method}`);
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Sharing failed. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Handles the "Start New Project" button click
   * 
   * Resets the form data via the onReset callback and reloads the page
   * to start fresh with a new louver selection project.
   * 
   * 🔄 This provides a clean slate for users who want to create
   * multiple louver specifications for different projects.
   */
  const handleNewProject = () => {
    onReset();
    window.location.reload();
  };

  /**
   * Converts technical application codes to user-friendly display names
   * 
   * Maps the internal louverApplication codes to more readable names
   * for display in the summary. Falls back to the purpose field if needed.
   * 
   * 📚 This mapping ensures technical codes are translated to terms
   * that make sense to end users and stakeholders.
   */
  const getApplicationName = () => {
    const appMap = {
      'mission-critical': 'Mission Critical',
      'commercial-general': 'Commercial General',
      'industrial-warehouse': 'Industrial & Warehouse',
      'infrastructure': 'Infrastructure',
      'screening-aesthetic': 'Screening & Aesthetic',
      'specialized-acoustic': 'Specialized Acoustic'
    };
    return formData.louverApplication 
      ? appMap[formData.louverApplication as keyof typeof appMap]
      : formData.purpose?.replace('-', ' ');
  };
  
  // Max Width Responsive Layout
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth <= 1100;
      setIsMobilePortrait(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <div className="summary-step scrollable-page">
      {isMobilePortrait && ( // Max Width Responsive Layout
      <div className="mobile-orientation-lock">
        <div className="overlay-orb-container">
          <div className="overlay-orb">
            <div className="overlay-lava"></div>
            <div className="overlay-orb-ping"></div>
            <div className="overlay-orb-pulse"></div>
            <div className="overlay-orb-highlight"></div>
            <div className="overlay-orb-glow"></div>
          </div>
        </div>
        <div className="rotate-message">
          Please view on desktop for the Luva experience
        </div>
      </div>
      )}
      <div className="summary-completion">

        {/* Main Message */}
        <h2 className="summary-title">You're ready to go.</h2>
        
        <p className="summary-description">
          Our technical team will contact you within <span className="highlight">2-5 business days</span> to discuss your project in more detail and provide comprehensive specifications.
        </p>
        
        {/* Project Summary */}
        <div className="summary-card">
          <h3 className="summary-card-title">Your Project Summary</h3>
          <div className="summary-grid">
            <div className="summary-grid-item">
              <span className="summary-label">Contact:</span>
              <div className="summary-value">{formData.name}</div>
              <div className="summary-subvalue">{formData.email}</div>
            </div>
            <div className="summary-grid-item">
              <span className="summary-label">Location:</span>
              <div className="summary-value">{formData.location}</div>
              <div className="summary-subvalue capitalize">{formData.environment} environment</div>
            </div>
            <div className="summary-grid-item">
              <span className="summary-label">Application:</span>
              <div className="summary-value">{getApplicationName()}</div>
              {formData.airflowRequirement && (
                <div className="summary-subvalue capitalize">
                  {formData.airflowRequirement} airflow • {formData.waterTolerance} water tolerance
                </div>
              )}
            </div>
            <div className="summary-grid-item">
              <span className="summary-label">Solution:</span>
              <div className="summary-value">
                {recommendedModel ? recommendedModel : 'AI-matched recommendation'}
              </div>
              <div className="summary-subvalue">Based on performance analysis</div>
            </div>
          </div>
        </div>

        {/* Weather Summary - if available */}
        {weatherData && (
          <WeatherSummary weatherData={weatherData} />
        )}

        {/* Action Buttons */}
        <p className="summary-prompt">In the meantime, you can:</p>
        
        <div className="summary-actions">
          <button 
            onClick={handleDownloadSummary}
            className="summary-download-btn"
            disabled={isDownloading}
            style={{
              opacity: isDownloading ? 0.7 : 1,
              cursor: isDownloading ? 'not-allowed' : 'pointer'
            }}
          >
            <Download className="summary-download-icon" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Summary (PDF)'}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="summary-download-btn"
            disabled={isSharing}
            style={{
              opacity: isSharing ? 0.7 : 1,
              cursor: isSharing ? 'not-allowed' : 'pointer'
            }}
          >
            <Share2 className="summary-download-icon" />
            <span>{isSharing ? 'Opening Share...' : 'Share Results'}</span>
          </button>
        </div>

        {/* What's Next */}
        <div className="summary-card">
          <h3 className="summary-card-title">What happens next?</h3>
          
          <div className="summary-steps">
            <div className="summary-step-item">
              <div className="summary-step-number">1</div>
              <div className="summary-step-content">
                <h4 className="summary-step-title">AI Analysis Review</h4>
                <p className="summary-step-description">
                  Our engineers review your AI recommendation for accuracy and compliance with local standards.
                  {weatherData && ' Weather data is integrated into the final analysis.'}
                </p>
              </div>
            </div>
            
            <div className="summary-step-item">
              <div className="summary-step-number">2</div>
              <div className="summary-step-content">
                <h4 className="summary-step-title">Detailed Consultation</h4>
                <p className="summary-step-description">
                  We'll contact you to discuss specific requirements, sizing, customizations, and installation details.
                </p>
              </div>
            </div>
            
            <div className="summary-step-item">
              <div className="summary-step-number">3</div>
              <div className="summary-step-content">
                <h4 className="summary-step-title">Final Specifications</h4>
                <p className="summary-step-description">
                  Receive comprehensive technical drawings, performance data, compliance certificates, and installation guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and New Project Buttons */}
        <div className="summary-navigation">
          <button 
            onClick={handleNewProject}
            className="summary-download-btn"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <RotateCcw size={16} />
            <span>Start New Project</span>
          </button>
        </div>

        {/* Company Info */}
        <div className="summary-footer">
          <h4 className="summary-footer-title">Powered by Fameline APSG</h4>
          <p className="summary-footer-text">
            Performance Louver Solutions for the Built Environment
          </p>
          <p className="summary-footer-locations">
            Singapore • Malaysia • Thailand • Indonesia • Vietnam • Philippines • Cambodia • India
          </p>
          {weatherData && (
            <p className="summary-footer-weather">
              Climate data provided by Google Earth Engine • Historical analysis: {weatherData.period}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};