import Papa from 'papaparse';
import { LouverModel, CsvLouverData, PerformanceGrade } from '@/types';
import louverCsvData from './louverdata.csv?raw';

class LouverDatabase {
  private static instance: LouverDatabase;
  private louvers: LouverModel[] = [];
  private isLoaded = false;

  private constructor() {}

  static getInstance(): LouverDatabase {
    if (!LouverDatabase.instance) {
      LouverDatabase.instance = new LouverDatabase();
    }
    return LouverDatabase.instance;
  }

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

  private generateId(model: string): string {
    return model.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  async getAllLouvers(): Promise<LouverModel[]> {
    await this.loadData();
    return [...this.louvers];
  }

  async getLouverById(id: string): Promise<LouverModel | null> {
    await this.loadData();
    return this.louvers.find(louver => louver.id === id) || null;
  }

  async getLouversByType(type: string): Promise<LouverModel[]> {
    await this.loadData();
    return this.louvers.filter(louver => louver.type === type);
  }

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

  // Get performance score for a louver at specific velocity
  getPerformanceScore(louver: LouverModel, velocity: number): number {
    const velocityKey = velocity.toFixed(1);
    const grade = louver.velocityRatings[velocityKey];
    
    const gradeScores = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return gradeScores[grade as keyof typeof gradeScores] || 0;
  }

  // Get average performance across all velocities
  getAveragePerformance(louver: LouverModel): number {
    const velocities = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
    const scores = velocities.map(v => this.getPerformanceScore(louver, v));
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // Get rating score (Excellent=4, Very Good=3, Good=2, Fair=1)
  getRatingScore(rating: string): number {
    const ratingScores = { 'Excellent': 4, 'Very Good': 3, 'Good': 2, 'Fair': 1 };
    return ratingScores[rating as keyof typeof ratingScores] || 0;
  }

  // Search louvers by text
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

// Export singleton instance
export const louverDatabase = LouverDatabase.getInstance();