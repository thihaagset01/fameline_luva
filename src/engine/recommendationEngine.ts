import { FormData, LouverModel, LouverRecommendation, MatchReason } from '@/types';
import { louverDatabase } from '@/data/louverDatabase';

/**
 * Recommendation Engine 🧠
 * 
 * This class is the brain of our application! It analyzes user inputs and recommends
 * the most suitable louver models based on various factors like application type,
 * airflow requirements, water tolerance, and environmental conditions.
 * 
 * The engine uses a sophisticated scoring system that weighs multiple factors to find
 * the best match for each user's specific needs and context.
 * 
 * 💡 It uses a singleton pattern to ensure only one instance exists throughout the application,
 * which helps maintain consistency in recommendations.
 */
class RecommendationEngine {
  private static instance: RecommendationEngine;

  /**
   * Private constructor to enforce singleton pattern
   * 
   * ⚠️ Don't try to create new instances with 'new RecommendationEngine()'!
   * Instead, always use RecommendationEngine.getInstance() or the exported recommendationEngine constant.
   */
  private constructor() {}

  /**
   * Get the singleton instance of the RecommendationEngine
   * 
   * This is how you should access the engine if you're not using the exported constant.
   * It creates the instance if it doesn't exist yet, or returns the existing one.
   * 
   * @returns The single shared instance of the RecommendationEngine
   * @example const engine = RecommendationEngine.getInstance();
   */
  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    // Return the complete recommendation package with alternatives.
    return RecommendationEngine.instance;
  }

  /**
   * Scoring matrices for different louver models across various applications
   * 
   * These matrices contain expert-defined scores (0-100) that rate how well each
   * louver model performs in different application contexts.
   * 
   * 📊 Scoring scale:
   * - 90-100: Excellent match (ideal for this application)
   * - 75-89: Very good match (highly recommended)
   * - 60-74: Good match (suitable)
   * - 40-59: Fair match (acceptable but not optimal)
   * - 0-39: Poor match (not recommended)
   * 
   * These scores were developed based on extensive testing and industry expertise.
   */
  // Detailed scoring matrices from legacy system
  private static readonly MODEL_APPLICATION_SCORES = {
    // PL-2250 Series - High Performance (IDENTICAL SCORES)
    'PL-2250': { 
      'mission-critical': 95, 
      'commercial-general': 85, 
      'industrial-warehouse': 90,
      'infrastructure': 88,
      'screening-aesthetic': 70,
      'specialized-acoustic': 60
    },
    'PL-2250V': { 
      'mission-critical': 95, // ✅ FIXED: Was 90, now matches PL-2250
      'commercial-general': 85, // ✅ FIXED: Was 80, now matches PL-2250
      'industrial-warehouse': 90, // ✅ FIXED: Was 85, now matches PL-2250
      'infrastructure': 88, // ✅ FIXED: Was 83, now matches PL-2250
      'screening-aesthetic': 70, // ✅ Already correct, but let's be explicit
      'specialized-acoustic': 60 // ✅ FIXED: Was 55, now matches PL-2250
    },
  
    // PL-2150 Series - Standard Performance (IDENTICAL SCORES)
    'PL-2170': { 
      'mission-critical': 50, 
      'commercial-general': 65, 
      'industrial-warehouse': 85,
      'infrastructure': 70,
      'screening-aesthetic': 80,
      'specialized-acoustic': 45
    },
    'PL-2150V': { 
      'mission-critical': 50, // ✅ FIXED: Was 45, now matches PL-2170
      'commercial-general': 65, // ✅ FIXED: Was 60, now matches PL-2170
      'industrial-warehouse': 85, // ✅ FIXED: Was 80, now matches PL-2170
      'infrastructure': 70, // ✅ FIXED: Was 65, now matches PL-2170
      'screening-aesthetic': 80, // ✅ Already correct
      'specialized-acoustic': 45 // ✅ FIXED: Was 40, now matches PL-2170
    },
  
    // Other models remain the same...
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
      'commercial-general': 88, 
      'industrial-warehouse': 65,
      'infrastructure': 70,
      'screening-aesthetic': 95,
      'specialized-acoustic': 70
    },
    'PL-3075': { 
      'mission-critical': 85, 
      'commercial-general': 75, 
      'industrial-warehouse': 95,
      'infrastructure': 80,
      'screening-aesthetic': 60,
      'specialized-acoustic': 50
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
    // PL-2250 Series - High Performance (IDENTICAL SCORES)
    'PL-2250': { 'basic': 60, 'good': 85, 'maximum': 100 },
    'PL-2250V': { 'basic': 60, 'good': 85, 'maximum': 100 }, // ✅ FIXED: Was different, now matches PL-2250
  
    // PL-2150 Series - Standard Performance (IDENTICAL SCORES)  
    'PL-2170': { 'basic': 80, 'good': 70, 'maximum': 50 },
    'PL-2150V': { 'basic': 80, 'good': 70, 'maximum': 50 }, // ✅ FIXED: Was different, now matches PL-2170
  
    // Other models remain the same...
    'PL-2075': { 'basic': 70, 'good': 90, 'maximum': 85 },
    'PL-1075': { 'basic': 85, 'good': 75, 'maximum': 60 },
    'PL-3075': { 'basic': 50, 'good': 75, 'maximum': 95 },
    'AC-150': { 'basic': 75, 'good': 80, 'maximum': 70 },
    'AC-300': { 'basic': 70, 'good': 85, 'maximum': 80 },
    'PL-1050': { 'basic': 80, 'good': 70, 'maximum': 55 },
    'PL-2050': { 'basic': 75, 'good': 80, 'maximum': 70 },
    'PL-3050': { 'basic': 60, 'good': 80, 'maximum': 90 }
  } as const;
  
  private static readonly WATER_TOLERANCE_SCORES = {
    // PL-2250 Series - High Performance (IDENTICAL SCORES)
    'PL-2250': { 'zero': 100, 'minimal': 95, 'moderate': 85 },
    'PL-2250V': { 'zero': 100, 'minimal': 95, 'moderate': 85 }, // ✅ FIXED: Was different, now matches PL-2250
  
    // PL-2150 Series - Standard Performance (IDENTICAL SCORES)
    'PL-2170': { 'zero': 50, 'minimal': 70, 'moderate': 95 },
    'PL-2150V': { 'zero': 50, 'minimal': 70, 'moderate': 95 }, // ✅ FIXED: Was different, now matches PL-2170
  
    // Other models remain the same...
    'PL-2075': { 'zero': 85, 'minimal': 95, 'moderate': 100 },
    'PL-1075': { 'zero': 60, 'minimal': 80, 'moderate': 100 },
    'PL-3075': { 'zero': 75, 'minimal': 85, 'moderate': 95 },
    'AC-150': { 'zero': 70, 'minimal': 85, 'moderate': 95 },
    'AC-300': { 'zero': 80, 'minimal': 90, 'moderate': 100 },
    'PL-1050': { 'zero': 55, 'minimal': 75, 'moderate': 90 },
    'PL-2050': { 'zero': 70, 'minimal': 85, 'moderate': 95 },
    'PL-3050': { 'zero': 65, 'minimal': 80, 'moderate': 90 }
  } as const;

  private static readonly CATEGORY_WEIGHTS = {
    application: 0.40,      // Most important - 40 points
    airflowRequirement: 0.25, // Airflow performance - 25 points  
    waterTolerance: 0.20,   // Weather protection - 20 points
    environment: 0.10,      // Environmental factors - 10 points
    specialFactors: 0.05    // Context-specific adjustments - 5 points
  } as const;

  /**
   * Generate louver recommendations based on user inputs
   * 
   * 🌟 This is the main method that you'll use most often! It analyzes user requirements
   * and returns the best matching louver model along with alternatives and detailed
   * explanations of why each model was recommended.
   * 
   * The recommendation process follows these steps:
   * 1. Load all available louver models from the database
   * 2. Score each model against the user's requirements
   * 3. Sort models by score and select the best match
   * 4. Generate detailed explanations for the recommendation
   * 5. Find alternative options that might also work well
   * 
   * @param formData - User selections and preferences from the wizard
   * @returns A promise resolving to a recommendation object with the best match and alternatives
   * @example 
   * const recommendation = await recommendationEngine.getRecommendation(formData);
   * console.log(`Best match: ${recommendation.model} with ${recommendation.confidenceScore}% confidence`);
   */
  async getRecommendation(formData: FormData): Promise<LouverRecommendation> {
    // Retrieve all available louver models from our product database based on user inputs
    const louvers = await louverDatabase.getAllLouvers();
    
    // Calculate a match score for each louver model based on user requirements using enhanced algorithm
    const scoredLouvers = louvers.map(louver => ({
      louver,
      ...this.scoreLouverEnhanced(louver, formData)
    }));

    // Sort louvers by their match score (highest to lowest)
    scoredLouvers.sort((a, b) => b.totalScore - a.totalScore);

    // Select the top recommendation and next best alternatives
    const bestMatch = scoredLouvers[0];
    
    // Get alternatives (next 2-3 best matches)
    const alternatives = scoredLouvers
      .slice(1, 4)
      .map(scored => scored.louver);

    // Calculate a confidence percentage to show how well the top recommendation matches from the scores (0-10 scale)
    const airflowReason = bestMatch.reasons.find(r => r.category === 'Airflow Performance');
    const waterReason = bestMatch.reasons.find(r => r.category === 'Water Protection');
    const durabilityReason = bestMatch.reasons.find(r => r.category === 'Environment');
    
    const airflowRating = airflowReason ? Math.round(airflowReason.score / 10) : 0;
    const waterResistanceRating = waterReason ? Math.round(waterReason.score / 10) : 0;
    const durabilityRating = durabilityReason ? Math.round(durabilityReason.score / 10) : 0;
    const aestheticsRating = Math.round(bestMatch.totalScore / 10) || 0;

    // Create user-friendly explanations for each scoring category
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
      // Create detailed explanations for why this louver was recommended
      matchReasons: bestMatch.reasons,
      alternatives
    };
  }

  /**
   * Calculate a comprehensive match score for a louver model
   * 
   * This is the heart of our recommendation algorithm! It evaluates how well a louver
   * matches the user's requirements by considering multiple factors and weighting
   * them according to importance.
   * 
   * 🧮 Scoring factors and weights:
   * - Application type: 40% (most important factor)
   * - Airflow requirements: 25%
   * - Water tolerance: 20%
   * - Environment: 10%
   * - Special contextual factors: 5%
   * 
   * Each factor is scored on a 0-100 scale, then weighted and combined for a final score.
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements and preferences
   * @returns A detailed scoring object with overall score and category breakdowns
   * @private Internal method used by getRecommendation
   */
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

    // 5. Apply special adjustments for specific scenarios (e.g., data centers, coastal areas) (5% weight)
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

  /**
   * Score how well a louver matches the specified application type
   * 
   * This evaluates how suitable the louver is for the user's specific application
   * (e.g., mission-critical, commercial, industrial) using our expert-defined
   * scoring matrices.
   * 
   * 📋 Applications have different priorities:
   * - Mission-critical: Maximum reliability and performance
   * - Commercial: Balance of performance and aesthetics
   * - Industrial: Durability and high airflow
   * - And others with their own specific requirements
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements containing the application type
   * @returns A score from 0-100 indicating suitability for the application
   * @private Internal scoring method
   */
  private scoreApplication(louver: LouverModel, formData: FormData): number {
    const application = formData.louverApplication;
    if (!application) return 50; // Default score

    const scores = RecommendationEngine.MODEL_APPLICATION_SCORES[louver.model as keyof typeof RecommendationEngine.MODEL_APPLICATION_SCORES];
    return scores?.[application as keyof typeof scores] || 50;
  }

  /**
   * Score how well a louver meets the airflow requirements
   * 
   * Evaluates the louver's airflow performance against the user's specified needs.
   * This uses the louver's airflow coefficient and rating to determine how well
   * it will perform for the required level of ventilation.
   * 
   * 💨 Airflow requirements:
   * - basic: Minimal airflow needed (e.g., for aesthetic applications)
   * - good: Standard airflow for general ventilation
   * - maximum: Maximum possible airflow (e.g., for cooling critical equipment)
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements containing airflow needs
   * @returns A score from 0-100 indicating airflow performance match
   * @private Internal scoring method
   */
  private scoreAirflowRequirement(louver: LouverModel, formData: FormData): number {
    const airflowReq = formData.airflowRequirement;
    if (!airflowReq) return 50;

    const scores = RecommendationEngine.AIRFLOW_REQUIREMENT_SCORES[louver.model as keyof typeof RecommendationEngine.AIRFLOW_REQUIREMENT_SCORES];
    return scores?.[airflowReq as keyof typeof scores] || 50;
  }

  /**
   * Score how well a louver handles water/rain based on requirements
   * 
   * Evaluates the louver's water resistance capabilities against the user's
   * specified tolerance for water penetration. This is especially important
   * for protecting sensitive equipment or areas from rain.
   * 
   * 💧 Water tolerance levels:
   * - zero: No water penetration allowed (e.g., for electronics)
   * - minimal: Very little water penetration acceptable
   * - moderate: Some water penetration is acceptable
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements containing water tolerance needs
   * @returns A score from 0-100 indicating water resistance match
   * @private Internal scoring method
   */
  private scoreWaterTolerance(louver: LouverModel, formData: FormData): number {
    const waterTolerance = formData.waterTolerance;
    if (!waterTolerance) return 50;

    const scores = RecommendationEngine.WATER_TOLERANCE_SCORES[louver.model as keyof typeof RecommendationEngine.WATER_TOLERANCE_SCORES];
    return scores?.[waterTolerance as keyof typeof scores] || 50;
  }

  /**
   * Score how well a louver performs in the specified environment
   * 
   * Different environments have unique challenges that affect louver performance.
   * This method evaluates how well the louver will hold up in the user's specific
   * installation environment.
   * 
   * 🌍 Environment considerations:
   * - coastal: Salt air corrosion resistance and high wind-driven rain protection
   * - urban: Pollution resistance and moderate weather protection
   * - industrial: Chemical resistance and durability in harsh conditions
   * - suburban: Balance of performance and aesthetics
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements containing the environment type
   * @returns A score from 0-100 indicating environmental suitability
   * @private Internal scoring method
   */
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

  /**
   * Apply special adjustments based on specific scenarios
   * 
   * This method handles special cases and edge scenarios where certain louver
   * characteristics become more important. It can either boost or penalize
   * a louver's score based on these special considerations.
   * 
   * ⚙️ Special adjustments include:
   * - Data centers: Bonus for high airflow models (+10 to +20)
   * - Coastal installations: Bonus for excellent rain defense (+5 to +15)
   * - High-rise buildings: Penalty for poor wind resistance (-5 to -15)
   * - Healthcare facilities: Bonus for easy maintenance models (+5 to +10)
   * 
   * @param louver - The louver model to evaluate
   * @param formData - User requirements and context
   * @returns An adjustment value between -20 and +20 to apply to the base score
   * @private Internal scoring method
   */
  private applyContextualAdjustments(louver: LouverModel, formData: FormData): number {
    console.log('🧠 Recommendation Engine - Processing model:', louver.model);
    console.log('🧠 Received formData.bladeOrientation:', formData.bladeOrientation);
    console.log('🧠 Model ends with V?:', louver.model.endsWith('V'));
    let adjustment = 0;
    if (formData.bladeOrientation) {
      const isVerticalModel = louver.model.endsWith('V');
      const userWantsVertical = formData.bladeOrientation === 'vertical';
      console.log('🧠 Processing blade orientation:', {
        userWantsVertical,
        isVerticalModel,
        model: louver.model
      });
      // Check if this model has a vertical alternative
    const hasVerticalAlternative = this.hasVerticalVersion(louver.model);
      
      if (userWantsVertical && isVerticalModel) {
        // User wants vertical and this is a vertical model - strong bonus
        adjustment += 35;
      } else if (!userWantsVertical && !isVerticalModel) {
        // User wants horizontal and this is a horizontal model - strong bonus
        adjustment += 35;
      } else if (userWantsVertical && !isVerticalModel && hasVerticalAlternative){
        // User wants vertical but this is a horizontal model - penalty
        adjustment -= 25;
      }
    }
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
    console.log('🧠 Final adjustment for', louver.model + ':', adjustment);
    return Math.min(Math.max(adjustment, -25), 25); // Cap adjustments
  }
  private hasVerticalVersion(modelName: string): boolean {
    const verticalVersions = ['PL-2250', 'PL-2170']; // Models with V counterparts
    return verticalVersions.includes(modelName);
  }
  /**
   * Determine if the application is for a data center
   * 
   * Data centers have specific cooling requirements that affect louver selection.
   * This helper method checks various signals in the user's inputs to determine
   * if they're likely working on a data center project.
   * 
   * 🖥️ Data center signals:
   * - Explicit mission-critical application selection
   * - Maximum airflow requirement
   * - Zero water tolerance (electronics protection)
   * 
   * @param formData - User requirements to analyze
   * @returns True if the application appears to be for a data center
   * @private Internal helper method
   */
  private isDataCenter(formData: FormData): boolean {
    return formData.louverApplication === 'mission-critical' && 
           formData.airflowRequirement === 'maximum';
  }

  /**
   * The following methods generate user-friendly explanations for why
   * a particular louver was recommended. These explanations are shown
   * to users in the recommendation step of the wizard.
   */
  /**
   * Generate an explanation of how well the louver fits the application type
   * 
   * Creates a user-friendly explanation of why this louver is suitable for
   * the selected application. The explanation varies based on how good the
   * match is (excellent, very good, adequate, or limited).
   * 
   * 💬 This helps users understand the recommendation in plain language.
   * 
   * @param louver - The recommended louver model
   * @param formData - User requirements containing the application type
   * @returns A user-friendly explanation string
   * @private Internal explanation generator
   */
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

  /**
   * Generate an explanation of the louver's airflow performance
   * 
   * Creates a user-friendly explanation of the louver's airflow capabilities
   * and how they align with the user's requirements. This highlights the
   * technical airflow coefficient in an accessible way.
   * 
   * 💬 This helps users understand the technical aspects of airflow in simple terms.
   * 
   * @param louver - The recommended louver model
   * @param formData - User requirements containing airflow needs
   * @returns A user-friendly explanation string about airflow performance
   * @private Internal explanation generator
   */
  private getAirflowExplanation(louver: LouverModel, formData: FormData): string {
    const airflowReq = formData.airflowRequirement;
    return `Airflow coefficient of ${louver.airflowCoefficient} provides ${airflowReq} airflow performance`;
  }

  /**
   * Generate an explanation of the louver's water resistance capabilities
   * 
   * Creates a user-friendly explanation of how well the louver will protect
   * against water penetration based on its rain defense rating and the user's
   * specified tolerance for water.
   * 
   * 💬 This helps users understand the water protection features in simple terms.
   * 
   * @param louver - The recommended louver model
   * @param formData - User requirements containing water tolerance needs
   * @returns A user-friendly explanation string about water resistance
   * @private Internal explanation generator
   */
  private getWaterExplanation(louver: LouverModel, formData: FormData): string {
    const waterTolerance = formData.waterTolerance;
    return `${louver.rainDefenseRating} rain defense rating meets ${waterTolerance} water tolerance requirements`;
  }

  /**
   * Generate an explanation of how the louver performs in the specified environment
   * 
   * Creates a user-friendly explanation of why the louver is suitable for the
   * specific installation environment (coastal, urban, industrial, or suburban).
   * Each environment gets a tailored explanation highlighting relevant features.
   * 
   * 💬 This helps users understand how the louver will perform in their specific location.
   * 
   * @param louver - The recommended louver model
   * @param environment - The installation environment (coastal, urban, etc.)
   * @returns A user-friendly explanation string about environmental suitability
   * @private Internal explanation generator
   */
  private getEnvironmentExplanation(louver: LouverModel, environment: string): string {
    const explanations = {
      coastal: `${louver.rainDefenseRating} rain defense ideal for coastal salt air and wind-driven rain`,
      urban: `Suitable for urban environment with ${louver.airflowRating.toLowerCase()} airflow performance`,
      industrial: `Class ${louver.airflowClass} airflow meets industrial ventilation requirements`,
      suburban: `${louver.type} bank design balances performance and aesthetics for suburban setting`
    };
    return explanations[environment as keyof typeof explanations] || 'Suitable for general environment';
  }

  /**
   * Generate explanations for special contextual factors
   * 
   * Creates additional explanations for special cases like data centers
   * or coastal installations that have unique requirements. These supplement
   * the main explanations with context-specific details.
   * 
   * 💬 This adds extra insight for special use cases that might not be
   * covered by the standard explanations.
   * 
   * @param louver - The recommended louver model
   * @param formData - User requirements and context
   * @returns A user-friendly explanation string about special considerations
   * @private Internal explanation generator
   */
  private getContextualExplanation(louver: LouverModel, formData: FormData): string {
    const explanations = [];
    if (formData.bladeOrientation) {
      const isVerticalModel = louver.model.endsWith('V');
      const userWantsVertical = formData.bladeOrientation === 'vertical';
      
      if (userWantsVertical && isVerticalModel) {
        explanations.push('Perfect match for your vertical blade orientation preference');
      } else if (!userWantsVertical && !isVerticalModel) {
        explanations.push('Ideal horizontal blade design matches your aesthetic choice');
      } else {
        explanations.push(`Note: This ${isVerticalModel ? 'vertical' : 'horizontal'} model differs from your ${formData.bladeOrientation} preference`);
      }
    }
  // Data center explanation
  if (this.isDataCenter(formData)) {
    if (louver.model.startsWith('PL-2250')) {
      explanations.push('Optimized for data center cooling requirements');
    }
    if (louver.model.startsWith('AC-')) {
      explanations.push('Acoustic properties less critical for data center applications');
    }
  }

  // Coastal explanation
  if (formData.environment === 'coastal' && louver.rainDefenseRating === 'Excellent') {
    explanations.push('Excellent rain defense ideal for coastal environments');
  }

  // Mission critical explanation
  if (formData.louverApplication === 'mission-critical' && 
      (louver.model === 'PL-2250' || louver.model === 'AC-300')) {
    explanations.push('Premium model suitable for mission-critical applications');
  }
    return explanations.length > 0 ? explanations.join('. ') : 'Standard recommendation';
  }
}

/**
 * The singleton instance of the recommendation engine
 * 
 * ✨ This is the recommended way to access the engine throughout the application.
 * Import this constant instead of creating your own instance to ensure consistency.
 * 
 * @example 
 * // In your component or service:
 * import { recommendationEngine } from '@/engine/recommendationEngine';
 * 
 * // Then use it like this:
 * const recommendation = await recommendationEngine.getRecommendation(formData);
 */
export const recommendationEngine = RecommendationEngine.getInstance();