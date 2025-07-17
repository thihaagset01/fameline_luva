import { FormData, LouverModel, LouverRecommendation, MatchReason } from '@/types';
import { louverDatabase } from '@/data/louverDatabase';
import { MATCH_WEIGHTS, GRADE_SCORES, RATING_SCORES } from '@/utils/constants';

class RecommendationEngine {
  private static instance: RecommendationEngine;

  private constructor() {}

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  async getRecommendation(formData: FormData): Promise<LouverRecommendation> {
    const louvers = await louverDatabase.getAllLouvers();
    
    // Score each louver
    const scoredLouvers = louvers.map(louver => ({
      louver,
      ...this.scoreLouver(louver, formData)
    }));

    // Sort by total score (descending)
    scoredLouvers.sort((a, b) => b.totalScore - a.totalScore);

    // Get the best match
    const bestMatch = scoredLouvers[0];
    
    // Get alternatives (next 2-3 best matches)
    const alternatives = scoredLouvers
      .slice(1, 4)
      .map(scored => scored.louver);

    return {
      louver: bestMatch.louver,
      confidence: Math.min(Math.round(bestMatch.totalScore * 10), 100), // Convert to percentage
      matchReasons: bestMatch.reasons,
      alternatives
    };
  }

  private scoreLouver(louver: LouverModel, formData: FormData) {
    const reasons: MatchReason[] = [];
    let totalScore = 0;

    // 1. Environment-based scoring
    const envScore = this.scoreEnvironment(louver, formData.environment);
    reasons.push({
      category: 'Environment',
      score: envScore,
      explanation: this.getEnvironmentExplanation(louver, formData.environment),
      weight: MATCH_WEIGHTS.environment
    });
    totalScore += envScore * MATCH_WEIGHTS.environment;

    // 2. Purpose-based scoring
    const purposeScore = this.scorePurpose(louver, formData.purpose);
    reasons.push({
      category: 'Purpose',
      score: purposeScore,
      explanation: this.getPurposeExplanation(louver, formData.purpose),
      weight: MATCH_WEIGHTS.purpose
    });
    totalScore += purposeScore * MATCH_WEIGHTS.purpose;

    // 3. Building type scoring
    const buildingScore = this.scoreBuildingType(louver, formData.buildingType);
    reasons.push({
      category: 'Building Type',
      score: buildingScore,
      explanation: this.getBuildingExplanation(louver, formData.buildingType),
      weight: MATCH_WEIGHTS.buildingType
    });
    totalScore += buildingScore * MATCH_WEIGHTS.buildingType;

    // 4. Building height scoring
    const heightScore = this.scoreBuildingHeight(louver, formData.buildingHeight);
    reasons.push({
      category: 'Building Height',
      score: heightScore,
      explanation: this.getHeightExplanation(louver, formData.buildingHeight),
      weight: MATCH_WEIGHTS.buildingHeight
    });
    totalScore += heightScore * MATCH_WEIGHTS.buildingHeight;

    // 5. Rain defense scoring
    const rainScore = RATING_SCORES[louver.rainDefenseRating];
    reasons.push({
      category: 'Rain Defense',
      score: rainScore,
      explanation: `${louver.rainDefenseRating} rain defense rating`,
      weight: MATCH_WEIGHTS.rainDefense
    });
    totalScore += rainScore * MATCH_WEIGHTS.rainDefense;

    // 6. Airflow performance scoring
    const airflowScore = RATING_SCORES[louver.airflowRating];
    reasons.push({
      category: 'Airflow Performance',
      score: airflowScore,
      explanation: `${louver.airflowRating} airflow rating with coefficient ${louver.airflowCoefficient}`,
      weight: MATCH_WEIGHTS.airflow
    });
    totalScore += airflowScore * MATCH_WEIGHTS.airflow;

    return { totalScore, reasons };
  }

  private scoreEnvironment(louver: LouverModel, environment: string): number {
    // Environment-based logic
    switch (environment) {
      case 'coastal':
        // Coastal needs excellent rain defense
        return louver.rainDefenseRating === 'Excellent' ? 4 : 
               louver.rainDefenseRating === 'Very Good' ? 3 : 2;
      
      case 'urban':
        // Urban areas benefit from acoustic properties and good airflow
        if (louver.model.startsWith('AC-')) return 4; // Acoustic models
        return louver.airflowRating === 'Excellent' ? 4 : 3;
      
      case 'industrial':
        // Industrial needs robust performance and airflow
        return louver.airflowClass <= 2 ? 4 : louver.airflowClass === 3 ? 3 : 2;
      
      case 'suburban':
        // Suburban is more balanced, aesthetic considerations
        return louver.type === 'Double' ? 4 : louver.type === 'Single' ? 3 : 2;
      
      default:
        return 3;
    }
  }

  private scorePurpose(louver: LouverModel, purpose: string): number {
    switch (purpose) {
      case 'ventilation':
        // High airflow coefficient and excellent airflow rating preferred
        if (louver.airflowCoefficient > 0.3 && louver.airflowRating === 'Excellent') return 4;
        if (louver.airflowCoefficient > 0.2) return 3;
        return 2;
      
      case 'weather-protection':
        // Excellent rain defense is critical
        return louver.rainDefenseRating === 'Excellent' ? 4 : 
               louver.rainDefenseRating === 'Very Good' ? 3 : 2;
      
      case 'acoustic':
        // Acoustic models (AC-series) are best, others get lower scores
        if (louver.model.startsWith('AC-')) return 4;
        return louver.type === 'Triple' ? 3 : louver.type === 'Double' ? 2 : 1;
      
      case 'aesthetic':
        // Architectural line series with hidden mullions preferred
        if (louver.model.includes('2250')) return 4; // High-performance models
        return louver.type === 'Double' ? 3 : 2;
      
      default:
        return 3;
    }
  }

  private scoreBuildingType(louver: LouverModel, buildingType: string): number {
    switch (buildingType) {
      case 'healthcare':
        // Healthcare needs acoustic control and excellent air quality
        if (louver.model.startsWith('AC-')) return 4;
        return louver.airflowRating === 'Excellent' ? 3 : 2;
      
      case 'education':
        // Schools need acoustic control
        if (louver.model.startsWith('AC-')) return 4;
        return 3;
      
      case 'industrial':
        // Industrial needs robust airflow
        return louver.airflowClass <= 2 ? 4 : 3;
      
      case 'commercial':
        // Commercial benefits from aesthetic and performance balance
        if (louver.model.includes('2250')) return 4;
        return louver.type === 'Double' ? 3 : 2;
      
      case 'residential':
        // Residential prefers aesthetic and moderate performance
        return louver.type === 'Single' ? 3 : louver.type === 'Double' ? 4 : 2;
      
      default:
        return 3;
    }
  }

  private scoreBuildingHeight(louver: LouverModel, height: string): number {
    switch (height) {
      case 'high-rise':
        // High-rise needs excellent rain defense due to wind pressure
        return louver.rainDefenseRating === 'Excellent' ? 4 : 2;
      
      case 'mid-rise':
        // Mid-rise needs good balance
        return louver.rainDefenseRating === 'Excellent' ? 4 : 
               louver.rainDefenseRating === 'Very Good' ? 3 : 2;
      
      case 'low-rise':
        // Low-rise can be more flexible
        return 3;
      
      default:
        return 3;
    }
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

  private getPurposeExplanation(louver: LouverModel, purpose: string): string {
    const explanations = {
      ventilation: `Airflow coefficient of ${louver.airflowCoefficient} provides ${louver.airflowRating.toLowerCase()} ventilation`,
      'weather-protection': `${louver.rainDefenseRating} rain defense rating ensures superior weather protection`,
      acoustic: louver.model.startsWith('AC-') ? 'Dedicated acoustic louver for noise control' : `${louver.type} bank design provides moderate acoustic benefits`,
      aesthetic: `${louver.type} bank ${louver.frontBlade.toLowerCase()} blade design for architectural integration`
    };
    return explanations[purpose as keyof typeof explanations] || 'Balanced performance for general purpose';
  }

  private getBuildingExplanation(louver: LouverModel, buildingType: string): string {
    const explanations = {
      healthcare: louver.model.startsWith('AC-') ? 'Acoustic control for patient comfort' : `${louver.airflowRating} airflow for healthy indoor environment`,
      education: louver.model.startsWith('AC-') ? 'Acoustic louver for learning environment' : 'Suitable for educational facility ventilation',
      industrial: `Class ${louver.airflowClass} airflow meets industrial ventilation standards`,
      commercial: `Professional appearance with ${louver.airflowRating.toLowerCase()} performance for commercial spaces`,
      residential: `${louver.type} bank design appropriate for residential scale and aesthetics`
    };
    return explanations[buildingType as keyof typeof explanations] || 'Suitable for building type';
  }

  private getHeightExplanation(louver: LouverModel, height: string): string {
    const explanations = {
      'high-rise': `${louver.rainDefenseRating} rain defense handles high-altitude wind pressures`,
      'mid-rise': `Balanced performance suitable for ${height} building exposure`,
      'low-rise': `Appropriate performance level for ${height} building requirements`
    };
    return explanations[height as keyof typeof explanations] || 'Suitable for building height';
  }
}

export const recommendationEngine = RecommendationEngine.getInstance();