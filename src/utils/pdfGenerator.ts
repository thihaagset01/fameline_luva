import jsPDF from 'jspdf';
import { FormData, WeatherData } from '@/types';

/**
 * PDF Generator for Fameline Louver Application
 * Generates professional PDF reports with project details
 */

// Helper function to convert application codes to readable names
const getApplicationName = (formData: FormData): string => {
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
    : formData.purpose?.replace('-', ' ') || 'General Application';
};

/**
 * Main PDF generation function
 */
export const generatePDFSummary = async (
  formData: FormData, 
  weatherData: WeatherData | null,
  recommendedModel?: string
): Promise<{ success: boolean; fileName?: string; error?: string }> => {
  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add Fameline Header
    pdf.setFontSize(24);
    pdf.setTextColor(16, 185, 129); // Fameline green
    pdf.text('FAMELINE LUVA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Louver Specification Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Project Information Section
    pdf.setFontSize(14);
    pdf.setTextColor(16, 185, 129);
    pdf.text('PROJECT INFORMATION', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const projectInfo = [
      ['Contact Name:', formData.name || 'Not specified'],
      ['Email:', formData.email || 'Not specified'],
      ['Location:', formData.location || 'Not specified'],
      ['Environment:', formData.environment || 'Not specified'],
      ['Application:', getApplicationName(formData)],
      ['Building Type:', formData.buildingType || 'Not specified'],
      ['Building Height:', formData.buildingHeight || 'Not specified'],
      ['Purpose:', formData.purpose || 'Not specified']
    ];

    projectInfo.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.text(value, 80, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Performance Requirements Section
    if (formData.airflowRequirement || formData.waterTolerance) {
      pdf.setFontSize(14);
      pdf.setTextColor(16, 185, 129);
      pdf.text('PERFORMANCE REQUIREMENTS', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      if (formData.airflowRequirement) {
        pdf.text('Airflow Requirement:', 20, yPosition);
        pdf.text(formData.airflowRequirement, 80, yPosition);
        yPosition += 6;
      }
      
      if (formData.waterTolerance) {
        pdf.text('Water Tolerance:', 20, yPosition);
        pdf.text(formData.waterTolerance, 80, yPosition);
        yPosition += 6;
      }

      yPosition += 10;
    }

    // Weather Data Section
    if (weatherData) {
      pdf.setFontSize(14);
      pdf.setTextColor(16, 185, 129);
      pdf.text('CLIMATE ANALYSIS', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      const weatherInfo = [
        ['Temperature:', `${weatherData.temperature}°C`],
        ['Rainfall:', `${weatherData.rainfall}mm`],
        ['Wind Speed:', `${weatherData.windSpeed} m/s`],
        ['Wind Direction:', `${weatherData.windDirection}°`]
      ];

      weatherInfo.forEach(([label, value]) => {
        pdf.text(label, 20, yPosition);
        pdf.text(value, 80, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    }

    // Aesthetic Preferences Section
    if (formData.mullionVisibility || formData.bladeOrientation || formData.color) {
      pdf.setFontSize(14);
      pdf.setTextColor(16, 185, 129);
      pdf.text('DESIGN AESTHETICS', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      if (formData.mullionVisibility) {
        pdf.text('Mullion Visibility:', 20, yPosition);
        pdf.text(formData.mullionVisibility, 80, yPosition);
        yPosition += 6;
      }
      
      if (formData.bladeOrientation) {
        pdf.text('Blade Orientation:', 20, yPosition);
        pdf.text(formData.bladeOrientation, 80, yPosition);
        yPosition += 6;
      }
      
      if (formData.color) {
        pdf.text('Selected Color:', 20, yPosition);
        pdf.text(formData.color, 80, yPosition);
        yPosition += 6;
      }

      yPosition += 10;
    }

    // AI Recommendation Section
    if (recommendedModel) {
      pdf.setFontSize(14);
      pdf.setTextColor(16, 185, 129);
      pdf.text('AI RECOMMENDATION', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Recommended Model: ${recommendedModel}`, 20, yPosition);
      yPosition += 10;

      // Add recommendation reasoning
      pdf.setFontSize(10);
      pdf.text('This recommendation is based on:', 20, yPosition);
      yPosition += 6;
      pdf.text('• Environmental conditions and climate data', 25, yPosition);
      yPosition += 5;
      pdf.text('• Building specifications and requirements', 25, yPosition);
      yPosition += 5;
      pdf.text('• Performance criteria and airflow needs', 25, yPosition);
      yPosition += 5;
      pdf.text('• Aesthetic preferences and design goals', 25, yPosition);
      yPosition += 15;
    }

    // Footer with generation timestamp
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated on ${timestamp} by Fameline Luva AI`, 20, pageHeight - 10);

    // Save the PDF
    const fileName = `Fameline_Luva_Report_${formData.name?.replace(/\s+/g, '_') || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };

  } catch (error) {
    console.error('PDF generation failed:', error);
    return { success: false, error: (error as Error).message };
  }
};