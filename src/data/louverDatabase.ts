import Papa from 'papaparse';
import { LouverModel, CsvLouverData, PerformanceGrade } from '@/types';
import louverCsvData from './louverdata.csv?raw';

/**
 * Welcome to the Louver Database! 🏢
 * 
 * This class is the central hub for managing our louver product catalog. It's designed to make it easy to work with louver data, which is loaded from a CSV file.
 * 
 * 💡 We're using the Singleton pattern here, which means only one instance of this class can exist at a time.
 * This helps keep things simple and ensures we're all working with the same data throughout the application.
 * 
 * The database provides a range of methods to help you search, filter, and retrieve louver models based on different criteria,
 * such as type, performance ratings, and more.
 * 
 * 📝 Quick Start:
 * - To get all louvers: await louverDatabase.getAllLouvers()
 * - To find a specific louver: await louverDatabase.getLouverById('ac-300')
 * - To search louvers: await louverDatabase.searchLouvers('double')
 */

class LouverDatabase {
  private static instance: LouverDatabase;
  private louvers: LouverModel[] = [];
  private isLoaded = false;

  /**
   * Private constructor to enforce the Singleton pattern
   * 
   * ⚠️ Don't try to create new instances with 'new LouverDatabase()'!
   * Instead, always use LouverDatabase.getInstance() or the exported louverDatabase constant.
   */
  private constructor() {}

  /**
   * Get the singleton instance of the LouverDatabase
   * 
   * This is how you should access the database if you're not using the exported constant.
   * It creates the instance if it doesn't exist yet, or returns the existing one.
   * 
   * @returns The single shared instance of the LouverDatabase
   * @example const db = LouverDatabase.getInstance();
   */
  static getInstance(): LouverDatabase {
    if (!LouverDatabase.instance) {
      LouverDatabase.instance = new LouverDatabase();
    }
    return LouverDatabase.instance;
  }

  /**
   * Load louver data from the CSV file
   * 
   * This method parses the CSV data and transforms it into LouverModel objects.
   * It's called automatically by other methods, so you typically don't need to call it directly.
   * 
   * 🔄 Smart loading: It only loads the data once, even if called multiple times,
   * which helps with performance.
   * 
   * @returns A promise that resolves when data is loaded
   * @throws Error if the data cannot be loaded
   */
  async loadData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const parsedData = Papa.parse<CsvLouverData>(louverCsvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parsedData.errors.length > 0) {
        console.warn('CSV parsing warnings:', parsedData.errors);
      }

      this.louvers = parsedData.data.map(csvRow => this.transformCsvToLouver(csvRow));
      this.isLoaded = true;
      console.log(`✅ Loaded ${this.louvers.length} louver models`);
    } catch (error) {
      console.error('Failed to load louver data:', error);
      throw new Error('Failed to initialize louver database');
    }
  }

  /**
   * Transform a CSV data row into a LouverModel object
   * 
   * This method maps raw CSV data to our application's louver model structure,
   * handling special fields like velocity ratings and generating unique IDs.
   * 
   * 🔄 Data transformation: 
   * - Extracts velocity ratings for different air speeds (0.0-3.5 m/s)
   * - Generates a URL-friendly ID from the model name
   * - Maps all fields to our standardized LouverModel structure
   * 
   * @param csvRow - A row of data from the CSV file
   * @returns A properly structured LouverModel object
   * @private Internal method used during data loading
   */
  private transformCsvToLouver(csvRow: CsvLouverData): LouverModel {
    // Extract velocity ratings
    const velocityRatings: Record<string, PerformanceGrade> = {};
    const velocities = ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5'];
    
    velocities.forEach(velocity => {
      const key = `Airflow Velocity: ${velocity}` as keyof CsvLouverData;
      velocityRatings[velocity] = csvRow[key] as PerformanceGrade;
    });

    return {
      id: this.generateId(csvRow['Louver Model']),
      model: csvRow['Louver Model'],
      type: csvRow['Type'] as any,
      frontBlade: csvRow['Front Blade'] as any,
      rearBlade: csvRow['Rear Blade'] === 'N/A' ? 'N/A' : csvRow['Rear Blade'] as any,
      bladePitch: csvRow['Blade Pitch'],
      louverDepth: csvRow['Louver Depth'],
      velocityRatings,
      airflowCoefficient: csvRow['Airflow Coefficient'],
      airflowClass: csvRow['Airflow Class'],
      rainDefenseRating: csvRow['Rain Defense Rating'] as any,
      airflowRating: csvRow['Airflow Rating'] as any
    };
  }

  /**
   * Generate a unique ID for a louver model
   * 
   * Creates a URL-friendly ID by converting the model name to lowercase
   * and replacing non-alphanumeric characters with hyphens.
   * 
   * 🔑 Example transformations:
   * - "AC-300" → "ac-300"
   * - "PL 2250" → "pl-2250"
   * - "X/Y_Model" → "x-y-model"
   * 
   * @param model - The louver model name (e.g., "PL-2250")
   * @returns A URL-friendly unique ID
   * @private Internal utility method
   */
  private generateId(model: string): string {
    return model.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  /**
   * Get all louver models in the database
   * 
   * Retrieves the complete catalog of louver models. This is useful when you need
   * to display all options or perform your own custom filtering.
   * 
   * ⚠️ Note: This returns a copy of the array, so modifying the returned array
   * won't affect the database's internal data.
   * 
   * @returns A promise that resolves to an array of all louver models
   * @example const allLouvers = await louverDatabase.getAllLouvers();
   */
  async getAllLouvers(): Promise<LouverModel[]> {
    await this.loadData();
    return [...this.louvers];
  }

  /**
   * Find a louver model by its unique ID
   * 
   * This is the most direct way to retrieve a specific louver when you know its ID.
   * The ID is typically derived from the model name (e.g., "ac-300" for model "AC-300").
   * 
   * 🔍 Common use case: Retrieving a louver from a URL parameter or saved reference.
   * 
   * @param id - The unique ID of the louver model to find (case-sensitive, e.g., "ac-300")
   * @returns A promise that resolves to the louver model or null if not found
   * @example const louver = await louverDatabase.getLouverById('ac-300');
   */
  async getLouverById(id: string): Promise<LouverModel | null> {
    await this.loadData();
    return this.louvers.find(louver => louver.id === id) || null;
  }

  /**
   * Get all louver models of a specific type
   * 
   * Filters the catalog to only include louvers of the specified type.
   * This is useful when you want to compare different models within the same category.
   * 
   * 📋 Available types:
   * - "Single": Single-bank louvers (simpler, more economical)
   * - "Double": Double-bank louvers (better weather protection)
   * - "Triple": Triple-bank louvers (maximum performance)
   * 
   * @param type - The louver type to filter by (case-sensitive, e.g., "Single", "Double")
   * @returns A promise that resolves to an array of matching louver models
   * @example const doubleLouvers = await louverDatabase.getLouversByType('Double');
   */
  async getLouversByType(type: string): Promise<LouverModel[]> {
    await this.loadData();
    return this.louvers.filter(louver => louver.type === type);
  }

  /**
   * Filter louver models based on multiple criteria
   * 
   * This powerful method allows filtering the louver catalog based on various
   * properties like type, ratings, and performance coefficients. All filters
   * are optional - only specify the ones you need.
   * 
   * 🔍 Advanced filtering: This is the most flexible way to find louvers that
   * match specific requirements. All conditions are combined with AND logic.
   * 
   * @param filters - An object containing filter criteria
   * @param filters.type - Filter by louver type (e.g., "Single", "Double")
   * @param filters.rainDefenseRating - Filter by rain defense rating (e.g., "Excellent")
   * @param filters.airflowRating - Filter by airflow rating (e.g., "Very Good")
   * @param filters.minAirflowCoefficient - Filter by minimum airflow coefficient
   * @param filters.maxAirflowCoefficient - Filter by maximum airflow coefficient
   * @returns A promise that resolves to an array of louvers matching all criteria
   * @example 
   * // Find excellent rain defense louvers with good airflow
   * const results = await louverDatabase.filterLouvers({
   *   rainDefenseRating: 'Excellent',
   *   airflowRating: 'Good',
   * });
   */
  async filterLouvers(filters: {
    type?: string;
    rainDefenseRating?: string;
    airflowRating?: string;
    minAirflowCoefficient?: number;
    maxAirflowCoefficient?: number;
  }): Promise<LouverModel[]> {
    await this.loadData();
    
    return this.louvers.filter(louver => {
      if (filters.type && louver.type !== filters.type) return false;
      if (filters.rainDefenseRating && louver.rainDefenseRating !== filters.rainDefenseRating) return false;
      if (filters.airflowRating && louver.airflowRating !== filters.airflowRating) return false;
      if (filters.minAirflowCoefficient && louver.airflowCoefficient < filters.minAirflowCoefficient) return false;
      if (filters.maxAirflowCoefficient && louver.airflowCoefficient > filters.maxAirflowCoefficient) return false;
      return true;
    });
  }

  /**
   * Get performance score for a louver at a specific air velocity
   * 
   * Converts letter grades (A, B, C, D) to numeric scores (4, 3, 2, 1)
   * for easier comparison and calculation.
   * 
   * 📊 Scoring system:
   * - 'A' = 4 (Excellent performance)
   * - 'B' = 3 (Very good performance)
   * - 'C' = 2 (Good performance)
   * - 'D' = 1 (Fair performance)
   * - Missing/invalid = 0 (Poor/no data)
   * 
   * @param louver - The louver model to evaluate
   * @param velocity - The air velocity in m/s (0.0-3.5)
   * @returns A numeric score from 0-4 representing performance
   * @example const score = louverDatabase.getPerformanceScore(louver, 1.5);
   */
  getPerformanceScore(louver: LouverModel, velocity: number): number {
    const velocityKey = velocity.toFixed(1);
    const grade = louver.velocityRatings[velocityKey];
    
    const gradeScores = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return gradeScores[grade as keyof typeof gradeScores] || 0;
  }

  /**
   * Calculate average performance across all standard velocities
   * 
   * This provides a single overall performance metric by averaging
   * scores across the standard test velocities (0.0-3.5 m/s).
   * 
   * 📈 Use this when you need a simple way to compare overall performance
   * between different louver models across all tested velocities.
   * 
   * Higher scores indicate better overall airflow performance across
   * the full range of air velocities.
   * 
   * @param louver - The louver model to evaluate
   * @returns A numeric score from 0-4 representing average performance
   * @example const avgScore = louverDatabase.getAveragePerformance(louver);
   */
  getAveragePerformance(louver: LouverModel): number {
    const velocities = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
    const scores = velocities.map(v => this.getPerformanceScore(louver, v));
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Convert text ratings to numeric scores
   * 
   * Transforms qualitative ratings into quantitative scores for calculations.
   * This is useful for comparing and ranking louvers based on their ratings.
   * 
   * 📊 Rating conversion:
   * - "Excellent" = 4 (Best possible rating)
   * - "Very Good" = 3 (Above average rating)
   * - "Good" = 2 (Average rating)
   * - "Fair" = 1 (Below average rating)
   * - Any other value = 0 (Invalid or missing rating)
   * 
   * @param rating - The text rating to convert (case-sensitive)
   * @returns A numeric score from 0-4
   * @example const score = louverDatabase.getRatingScore('Very Good'); // Returns 3
   */
  getRatingScore(rating: string): number {
    const ratingScores = { 'Excellent': 4, 'Very Good': 3, 'Good': 2, 'Fair': 1 };
    return ratingScores[rating as keyof typeof ratingScores] || 0;
  }

  /**
   * Search louvers by text across multiple fields
   * 
   * Performs a case-insensitive search across model name, type,
   * and rating fields to find matching louvers. This is perfect for
   * implementing a search box in the UI.
   * 
   * 🔍 Search fields:
   * - Model name (e.g., "AC-300")
   * - Type (e.g., "Single", "Double")
   * - Rain defense rating (e.g., "Excellent")
   * - Airflow rating (e.g., "Very Good")
   * 
   * @param query - The search text to look for (case-insensitive)
   * @returns A promise that resolves to an array of matching louvers
   * @example 
   * // Find all louvers with "300" in their name or "double" in any field
   * const results = await louverDatabase.searchLouvers('300');
   */
  async searchLouvers(query: string): Promise<LouverModel[]> {
    await this.loadData();
    const lowerQuery = query.toLowerCase();
    
    return this.louvers.filter(louver => 
      louver.model.toLowerCase().includes(lowerQuery) ||
      louver.type.toLowerCase().includes(lowerQuery) ||
      louver.rainDefenseRating.toLowerCase().includes(lowerQuery) ||
      louver.airflowRating.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * The singleton instance of the louver database
 * 
 * ✨ This is the recommended way to access the database throughout the application.
 * Import this constant instead of creating your own instance to ensure consistency.
 * 
 * @example 
 * // In your component or service:
 * import { louverDatabase } from '@/data/louverDatabase';
 * 
 * // Then use it like this:
 * const allLouvers = await louverDatabase.getAllLouvers();
 * const searchResults = await louverDatabase.searchLouvers('double');
 */
export const louverDatabase = LouverDatabase.getInstance();