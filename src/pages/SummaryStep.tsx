import * as React from 'react';
import './styles/SummaryStep.css';
import { Download, Share2, RotateCcw, CheckCircle } from 'lucide-react';
import { FormData, WeatherData } from '@/types';
import { WeatherSummary } from '@/components/WeatherSummary';

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
 */
interface SummaryStepProps {
  formData: FormData;
  onReset: () => void;
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
export const SummaryStep: React.FC<SummaryStepProps> = ({ formData, onReset }) => {
  /**
   * Parse stored weather data string back to object if available
   * Weather data enhances the recommendation with climate considerations
   */
  const weatherData: WeatherData | null = formData.weatherData 
    ? JSON.parse(formData.weatherData) 
    : null;

  /**
   * Handles the "Download Summary" button click
   * 
   * In the future, this will generate a PDF with all project details
   * and the louver recommendation. Currently shows a placeholder alert.
   * 
   * 📥 The PDF would include all form data and weather information
   * for a complete record of the recommendation.
   */
  const handleDownloadSummary = () => {
    // Generate PDF with weather data included
    console.log('Generating PDF summary with weather data...', formData);
    alert('PDF download would start here. Feature coming soon!');
  };

  /**
   * Handles the "Share Results" button click
   * 
   * Uses the Web Share API if available (mobile devices, modern browsers)
   * or falls back to copying the URL to clipboard on unsupported browsers.
   * 
   * 👥 This allows users to easily share their louver recommendation
   * with colleagues, contractors, or other stakeholders.
   */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Fameline Luva Recommendation',
        text: 'Check out my louver specification from Fameline Luva AI',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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

  return (
    <div className="summary-step scrollable-page">
      <div className="summary-completion">
        {/* Success Icon */}
        <div className="success-icon-container">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
        </div>

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
              <div className="summary-value">AI-matched recommendation</div>
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
          >
            <Download className="summary-download-icon" />
            <span>Download Summary (PDF)</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="summary-download-btn"
          >
            <Share2 className="summary-download-icon" />
            <span>Share Results</span>
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