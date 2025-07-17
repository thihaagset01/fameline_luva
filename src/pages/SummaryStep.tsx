import React from 'react';
import { Download, Share2, RotateCcw, CheckCircle } from 'lucide-react';
import { FormData } from '@/types';
import { NavigationButton } from '@/components/NavigationButton';

interface SummaryStepProps {
  formData: FormData;
  onReset: () => void;
  onPrevStep?: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ formData, onReset, onPrevStep }) => {
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
    <div className="max-w-4xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
      </div>

      {/* Main Message */}
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-light text-white mb-6">
          You're ready to go.
        </h2>
        
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-white/80 text-xl leading-relaxed">
            Our technical team will contact you within <span className="text-emerald-400 font-medium">2-5 business days</span> to discuss your project in more detail and provide comprehensive specifications.
          </p>
          
          <div className="glass-effect rounded-2xl p-6 text-left">
            <h3 className="text-emerald-400 font-medium mb-4">Your Project Summary</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-white/80">
              <div>
                <span className="text-white/60 text-sm">Contact:</span>
                <div className="font-medium">{formData.name}</div>
                <div className="text-sm">{formData.email}</div>
              </div>
              <div>
                <span className="text-white/60 text-sm">Location:</span>
                <div className="font-medium">{formData.location}</div>
                <div className="text-sm capitalize">{formData.environment} environment</div>
              </div>
              <div>
                <span className="text-white/60 text-sm">Building:</span>
                <div className="font-medium capitalize">{formData.buildingType}</div>
                <div className="text-sm capitalize">{formData.buildingHeight}</div>
              </div>
              <div>
                <span className="text-white/60 text-sm">Purpose:</span>
                <div className="font-medium capitalize">{formData.purpose.replace('-', ' ')}</div>
                <div className="text-sm">AI-matched solution</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-12">
        <p className="text-white/90 text-lg mb-8">In the meantime, you can:</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <button 
            onClick={handleDownloadSummary}
            className="w-full sm:w-auto btn-outline px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center space-x-3 hover:shadow-glow"
          >
            <Download className="w-5 h-5" />
            <span>Download Summary (PDF)</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="w-full sm:w-auto glass-effect hover:bg-white/20 px-8 py-4 rounded-full text-lg font-medium text-white flex items-center justify-center space-x-3 transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Results</span>
          </button>
        </div>
      </div>

      {/* What's Next */}
      <div className="glass-effect rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto">
        <h3 className="text-emerald-400 font-medium mb-6 text-center">What happens next?</h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Technical Review</h4>
              <p className="text-white/70 text-sm">Our engineers review your requirements and AI recommendation for accuracy and compliance.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Detailed Consultation</h4>
              <p className="text-white/70 text-sm">We'll contact you to discuss specific requirements, sizing, and any customizations needed.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Final Specifications</h4>
              <p className="text-white/70 text-sm">Receive comprehensive technical drawings, performance data, and installation guidelines.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and New Project Buttons */}
      <div className="flex justify-between items-center mt-8 mb-8">
        <NavigationButton 
          onClick={onPrevStep || (() => {})} 
          direction="prev" 
        />
        <button 
          onClick={handleNewProject}
          className="glass-effect hover:bg-white/20 px-6 py-3 rounded-full text-white flex items-center space-x-2 mx-auto transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Project</span>
        </button>
        <div className="w-10"></div> {/* Empty space to balance the layout */}
      </div>

      {/* Company Info */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="text-center">
          <h4 className="text-emerald-400 font-medium mb-2">Powered by Fameline APSG</h4>
          <p className="text-white/60 text-sm">
            Performance Louver Solutions for the Built Environment
          </p>
          <p className="text-white/40 text-xs mt-2">
            Singapore • Malaysia • Thailand • Indonesia • Vietnam • Philippines • Cambodia • India
          </p>
        </div>
      </div>
    </div>
  );
};