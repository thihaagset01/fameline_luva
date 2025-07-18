import React from 'react';
import { Download, Share2, RotateCcw, CheckCircle } from 'lucide-react';
import { FormData } from '@/types';

interface SummaryStepProps {
  formData: FormData;
  onReset: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ formData, onReset }) => {
  const handleDownloadSummary = () => {
    // This would generate and download a PDF summary
    console.log('Generating PDF summary...', formData);
    alert('PDF download would start here. Feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LouverBoy Recommendation',
        text: 'Check out my louver specification from LouverBoy AI',
        url: window.location.href
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleNewProject = () => {
    onReset();
    window.location.reload();
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
              <span className="summary-label">Building:</span>
              <div className="summary-value capitalize">{formData.buildingType}</div>
              <div className="summary-subvalue capitalize">{formData.buildingHeight}</div>
            </div>
            <div className="summary-grid-item">
              <span className="summary-label">Purpose:</span>
              <div className="summary-value capitalize">{formData.purpose.replace('-', ' ')}</div>
              <div className="summary-subvalue">AI-matched solution</div>
            </div>
          </div>
        </div>

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
                <h4 className="summary-step-title">Technical Review</h4>
                <p className="summary-step-description">Our engineers review your requirements and AI recommendation for accuracy and compliance.</p>
              </div>
            </div>
            
            <div className="summary-step-item">
              <div className="summary-step-number">2</div>
              <div className="summary-step-content">
                <h4 className="summary-step-title">Detailed Consultation</h4>
                <p className="summary-step-description">We'll contact you to discuss specific requirements, sizing, and any customizations needed.</p>
              </div>
            </div>
            
            <div className="summary-step-item">
              <div className="summary-step-number">3</div>
              <div className="summary-step-content">
                <h4 className="summary-step-title">Final Specifications</h4>
                <p className="summary-step-description">Receive comprehensive technical drawings, performance data, and installation guidelines.</p>
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
        </div>
      </div>
    </div>
  );
};