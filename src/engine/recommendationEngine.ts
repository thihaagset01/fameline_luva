import { FormData, LouverModel, LouverRecommendation, MatchReason } from '@/types';
import { louverDatabase } from '@/data/louverDatabase';

class RecommendationEngine {
  private static instance: RecommendationEngine;

  private constructor() {}

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  // Detailed scoring matrices from legacy system
  private static readonly MODEL_APPLICATION_SCORES = {
    'PL-2250': { 
      'mission-critical': 95, 
      'commercial-general': 85, 
      'industrial-warehouse': 90,
      'infrastructure': 88,
      'screening-aesthetic': 70,
      'specialized-acoustic': 60
    },
    'PL-2250V': { 
      'mission-critical': 90, 
      'commercial-general': 80, 
      'industrial-warehouse': 85,
      'infrastructure': 83,
      'screening-aesthetic': 75,
      'specialized-acoustic': 55
    },
    'PL-2075': { 
      'mission-critical': 80, 
      'commercial-general': 95, 
      'industrial-warehouse': 75,
      'infrastructure': 85,
      'screening-aesthetic': 85,
      'specialized-acoustic': 65
    },
    'PL-1075': { 
      'mission-critical': 60, 
      'commercial-general': 80, 
      'industrial-warehouse': 65,
      'infrastructure': 70,
      'screening-aesthetic': 95,
      'specialized-acoustic': 70
    },
    'PL-3075': { 
      'mission-critical': 85, 
      'commercial-general': 75, 
      'industrial-warehouse': 90,
      'infrastructure': 80,
      'screening-aesthetic': 60,
      'specialized-acoustic': 50
    },
    'PL-2170': { 
      'mission-critical': 50, 
      'commercial-general': 65, 
      'industrial-warehouse': 85,
      'infrastructure': 70,
      'screening-aesthetic': 80,
      'specialized-acoustic': 45
    },
    'PL-2150V': { 
      'mission-critical': 45, 
      'commercial-general': 60, 
      'industrial-warehouse': 80,
      'infrastructure': 65,
      'screening-aesthetic': 90,
      'specialized-acoustic': 40
    },
    'AC-150': { 
      'mission-critical': 70, 
      'commercial-general': 75, 
      'industrial-warehouse': 55,
      'infrastructure': 70,
      'screening-aesthetic': 60,
      'specialized-acoustic': 95
    },
    'AC-300': { 
      'mission-critical': 80, 
      'commercial-general': 85, 
      'industrial-warehouse': 65,
      'infrastructure': 80,
      'screening-aesthetic': 70,
      'specialized-acoustic': 100
    },
    'PL-1050': { 
      'mission-critical': 55, 
      'commercial-general': 65, 
      'industrial-warehouse': 80,
      'infrastructure': 60,
      'screening-aesthetic': 70,
      'specialized-acoustic': 45
    },
    'PL-2050': { 
      'mission-critical': 75, 
      'commercial-general': 70, 
      'industrial-warehouse': 85,
      'infrastructure': 75,
      'screening-aesthetic': 65,
      'specialized-acoustic': 50
    },
    'PL-3050': { 
      'mission-critical': 80, 
      'commercial-general': 70, 
      'industrial-warehouse': 95,
      'infrastructure': 75,
      'screening-aesthetic': 55,
      'specialized-acoustic': 45
    }
  } as const;

  private static readonly AIRFLOW_REQUIREMENT_SCORES = {
    'PL-2250': { 'basic': 60, 'good': 85, 'maximum': 100 },
    'PL-2250V': { 'basic': 55, 'good': 80, 'maximum': 95 },
    'PL-2075': { 'basic': 70, 'good': 90, 'maximum': 85 },
    'PL-1075': { 'basic': 85, 'good': 75, 'maximum': 60 },
    'PL-3075': { 'basic': 50, 'good': 75, 'maximum': 95 },
    'PL-2170': { 'basic': 80, 'good': 70, 'maximum': 50 },
    'PL-2150V': { 'basic': 90, 'good': 65, 'maximum': 45 },
    'AC-150': { 'basic': 75, 'good': 80, 'maximum': 70 },
    'AC-300': { 'basic': 70, 'good': 85, 'maximum': 80 },
    'PL-1050': { 'basic': 80, 'good': 70, 'maximum': 55 },
    'PL-2050': { 'basic': 75, 'good': 80, 'maximum': 70 },
    'PL-3050': { 'basic': 60, 'good': 80, 'maximum': 90 }
  } as const;

  private static readonly WATER_TOLERANCE_SCORES = {
    'PL-2250': { 'zero': 100, 'minimal': 95, 'moderate': 85 },
    'PL-2250V': { 'zero': 95, 'minimal': 90, 'moderate': 80 },
    'PL-2075': { 'zero': 85, 'minimal': 95, 'moderate': 100 },
    'PL-1075': { 'zero': 60, 'minimal': 80, 'moderate': 100 },
    'PL-3075': { 'zero': 75, 'minimal': 85, 'moderate': 95 },
    'PL-2170': { 'zero': 50, 'minimal': 70, 'moderate': 95 },
    'PL-2150V': { 'zero': 45, 'minimal': 65, 'moderate': 90 },
    'AC-150': { 'zero': 70, 'minimal': 85, 'moderate': 95 },
    'AC-300': { 'zero': 80, 'minimal': 90, 'moderate': 100 },
    'PL-1050': { 'zero': 55, 'minimal': 75, 'moderate': 90 },
    'PL-2050': { 'zero': 70, 'minimal': 85, 'moderate': 95 },
    'PL-3050': { 'zero': 65, 'minimal': 80, 'moderate': 90 }
  } as const;

  // Category weights (from legacy successful system)
  private static readonly CATEGORY_WEIGHTS = {
    application: 0.40,      // Most important - 40 points
    airflowRequirement: 0.25, // Airflow performance - 25 points  
    waterTolerance: 0.20,   // Weather protection - 20 points
    environment: 0.10,      // Environmental factors - 10 points
    specialFactors: 0.05    // Context-specific adjustments - 5 points
  } as const;

  async getRecommendation(formData: FormData): Promise<LouverRecommendation> {
    const louvers = await louverDatabase.getAllLouvers();
    
    // Score each louver using enhanced algorithm
    const scoredLouvers = louvers.map(louver => ({
      louver,
      ...this.scoreLouverEnhanced(louver, formData)
    }));

    // Sort by total score (descending)
    scoredLouvers.sort((a, b) => b.totalScore - a.totalScore);

    // Get the best match
    const bestMatch = scoredLouvers[0];
    
    // Get alternatives (next 2-3 best matches)
    const alternatives = scoredLouvers
      .slice(1, 4)
      .map(scored => scored.louver);

    // Calculate individual rating values from the scores (0-10 scale)
    const airflowReason = bestMatch.reasons.find(r => r.category === 'Airflow Performance');
    const waterReason = bestMatch.reasons.find(r => r.category === 'Water Protection');
    const durabilityReason = bestMatch.reasons.find(r => r.category === 'Environment');
    
    const airflowRating = airflowReason ? Math.round(airflowReason.score / 10) : 0;
    const waterResistanceRating = waterReason ? Math.round(waterReason.score / 10) : 0;
    const durabilityRating = durabilityReason ? Math.round(durabilityReason.score / 10) : 0;
    const aestheticsRating = Math.round(bestMatch.totalScore / 10) || 0;

    return {
      louver: bestMatch.louver,
      model: bestMatch.louver.model,
      type: bestMatch.louver.type,
      confidence: Math.min(Math.round(bestMatch.totalScore) / 100, 1), // 0-1 scale
      confidenceScore: Math.min(bestMatch.totalScore / 100, 1), // 0-1 scale
      airflowRating,
      waterResistanceRating,
      durabilityRating,
      aestheticsRating,
      matchReasons: bestMatch.reasons,
      alternatives
    };
  }

  private scoreLouverEnhanced(louver: LouverModel, formData: FormData) {
    const reasons: MatchReason[] = [];
    let totalScore = 0;

    // 1. Application-based scoring (40% weight)
    const applicationScore = this.scoreApplication(louver, formData);
    reasons.push({
      category: 'Application',
      score: applicationScore,
      explanation: this.getApplicationExplanation(louver, formData),
      weight: RecommendationEngine.CATEGORY_WEIGHTS.application
    });
    totalScore += applicationScore * RecommendationEngine.CATEGORY_WEIGHTS.application;

    // 2. Airflow requirement scoring (25% weight)
    const airflowScore = this.scoreAirflowRequirement(louver, formData);
    reasons.push({
      category: 'Airflow Performance',
      score: airflowScore,
      explanation: this.getAirflowExplanation(louver, formData),
      weight: RecommendationEngine.CATEGORY_WEIGHTS.airflowRequirement
    });
    totalScore += airflowScore * RecommendationEngine.CATEGORY_WEIGHTS.airflowRequirement;

    // 3. Water tolerance scoring (20% weight)
    const waterScore = this.scoreWaterTolerance(louver, formData);
    reasons.push({
      category: 'Water Protection',
      score: waterScore,
      explanation: this.getWaterExplanation(louver, formData),
      weight: RecommendationEngine.CATEGORY_WEIGHTS.waterTolerance
    });
    totalScore += waterScore * RecommendationEngine.CATEGORY_WEIGHTS.waterTolerance;

    // 4. Environment scoring (10% weight)
    const envScore = this.scoreEnvironment(louver, formData);
    reasons.push({
      category: 'Environment',
      score: envScore,
      explanation: this.getEnvironmentExplanation(louver, formData.environment),
      weight: RecommendationEngine.CATEGORY_WEIGHTS.environment
    });
    totalScore += envScore * RecommendationEngine.CATEGORY_WEIGHTS.environment;

    // 5. Apply contextual adjustments (5% weight)
    const contextScore = this.applyContextualAdjustments(louver, formData);
    if (contextScore !== 0) {
      reasons.push({
        category: 'Special Considerations',
        score: contextScore,
        explanation: this.getContextualExplanation(louver, formData),
        weight: RecommendationEngine.CATEGORY_WEIGHTS.specialFactors
      });
    }
    totalScore += contextScore * RecommendationEngine.CATEGORY_WEIGHTS.specialFactors;

    return { totalScore, reasons };
  }

  private scoreApplication(louver: LouverModel, formData: FormData): number {
    const application = formData.louverApplication;
    if (!application) return 50; // Default score

    const scores = RecommendationEngine.MODEL_APPLICATION_SCORES[louver.model as keyof typeof RecommendationEngine.MODEL_APPLICATION_SCORES];
    return scores?.[application as keyof typeof scores] || 50;
  }

  private scoreAirflowRequirement(louver: LouverModel, formData: FormData): number {
    const airflowReq = formData.airflowRequirement;
    if (!airflowReq) return 50;

    const scores = RecommendationEngine.AIRFLOW_REQUIREMENT_SCORES[louver.model as keyof typeof RecommendationEngine.AIRFLOW_REQUIREMENT_SCORES];
    return scores?.[airflowReq as keyof typeof scores] || 50;
  }

  private scoreWaterTolerance(louver: LouverModel, formData: FormData): number {
    const waterTolerance = formData.waterTolerance;
    if (!waterTolerance) return 50;

    const scores = RecommendationEngine.WATER_TOLERANCE_SCORES[louver.model as keyof typeof RecommendationEngine.WATER_TOLERANCE_SCORES];
    return scores?.[waterTolerance as keyof typeof scores] || 50;
  }

  private scoreEnvironment(louver: LouverModel, formData: FormData): number {
    // Enhanced environment scoring
    switch (formData.environment) {
      case 'coastal':
        // Coastal needs excellent rain defense
        return louver.rainDefenseRating === 'Excellent' ? 100 : 
               louver.rainDefenseRating === 'Very Good' ? 75 : 50;
      
      case 'urban':
        // Urban areas benefit from acoustic properties
        if (louver.model.startsWith('AC-')) return 100;
        return louver.airflowRating === 'Excellent' ? 85 : 70;
      
      case 'industrial':
        // Industrial needs robust airflow
        return louver.airflowClass <= 2 ? 100 : louver.airflowClass === 3 ? 75 : 50;
      
      case 'suburban':
        // Suburban is balanced
        return louver.type === 'Double' ? 90 : louver.type === 'Single' ? 75 : 60;
      
      default:
        return 70;
    }
  }

  private applyContextualAdjustments(louver: LouverModel, formData: FormData): number {
    let adjustment = 0;

    // Data center specific logic (from legacy)
    if (this.isDataCenter(formData)) {
      if (louver.model.startsWith('PL-2250')) {
        adjustment += 20; // Boost for cooling efficiency
      }
      if (louver.model.startsWith('AC-')) {
        adjustment -= 10; // Reduce acoustic importance for data centers
      }
    }

    // Coastal conditions boost
    if (formData.environment === 'coastal') {
      if (louver.rainDefenseRating === 'Excellent') {
        adjustment += 15;
      }
    }

    // Mission critical applications
    if (formData.louverApplication === 'mission-critical') {
      if (louver.model === 'PL-2250' || louver.model === 'AC-300') {
        adjustment += 10;
      }
    }

    return Math.min(Math.max(adjustment, -20), 20); // Cap adjustments
  }

  private isDataCenter(formData: FormData): boolean {
    return formData.louverApplication === 'mission-critical' && 
           formData.airflowRequirement === 'maximum';
  }

  // Enhanced explanation methods
  private getApplicationExplanation(louver: LouverModel, formData: FormData): string {
    const app = formData.louverApplication;
    const score = this.scoreApplication(louver, formData);
    
    if (score >= 90) {
      return `${louver.model} is excellently suited for ${app} applications`;
    } else if (score >= 75) {
      return `${louver.model} performs very well in ${app} environments`;
    } else if (score >= 60) {
      return `${louver.model} is adequate for ${app} applications`;
    } else {
      return `${louver.model} has limited suitability for ${app} applications`;
    }
  }

  private getAirflowExplanation(louver: LouverModel, formData: FormData): string {
    const airflowReq = formData.airflowRequirement;
    return `Airflow coefficient of ${louver.airflowCoefficient} provides ${airflowReq} airflow performance`;
  }

  private getWaterExplanation(louver: LouverModel, formData: FormData): string {
    const waterTolerance = formData.waterTolerance;
    return `${louver.rainDefenseRating} rain defense rating meets ${waterTolerance} water tolerance requirements`;
  }

  private getEnvironmentExplanation(louver: LouverModel, environment: string): string {
    const explanations = {
      coastal: `${louver.rainDefenseRating} rain defense ideal for coastal salt air and wind-driven rain`,
      urban: `Suitable for urban environment with ${louver.airflowRating.toLowerCase()} airflow performance`,
      industrial: `Class ${louver.airflowClass} airflow meets industrial ventilation requirements`,
      suburban: `${louver.type} bank design balances performance and aesthetics for suburban setting`
    };
    return explanations[environment as keyof typeof explanations] || 'Suitable for general environment';
  }

  private getContextualExplanation(louver: LouverModel, formData: FormData): string {
    const explanations = [];
    
    if (this.isDataCenter(formData)) {
      explanations.push('Optimized for data center cooling requirements');
    }
    
    if (formData.environment === 'coastal' && louver.rainDefenseRating === 'Excellent') {
      explanations.push('Enhanced weather protection for coastal exposure');
    }
    
    return explanations.join('; ') || 'Standard application considerations';
  }
}

export const recommendationEngine = RecommendationEngine.getInstance();