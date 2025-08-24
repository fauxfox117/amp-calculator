export interface LineData {
  id?: string;
  length: number;
  spacing: '6"' | '9"' | '12"';
  distanceToFirstLight: number;
}

export interface LightingSystem {
  id: string;
  name: string;
  totalLength: number;
  spacing: '6"' | '9"' | '12"';
  numberOfLines: number;
  distanceToFirstLight: number;
  lines?: LineData[]; // New: individual line data
  date: string;
  lightType: 'standard' | '3L' | 'globe' | 'soffit';
}

export interface LineResult {
  lineNumber: number;
  length: number;
  lightsPerLine: number;
  ampsNeeded: number;
  needsAmp: boolean;
  ampSplicePositions: number[];
}

export interface PowerSupplyInfo {
  totalWatts: number;
  minPsuWatts: number;
  suggestedPsuWatts: number;
  needsSecondaryPsu: boolean;
  secondaryPsuWatts?: number;
  psuRecommendation: string;
  wattsBreakdown: {
    standard?: number;
    threeL?: number;
    downlights?: number;
    commercial?: number;
    globe?: number;
  };
}

export interface CalculationResult {
  totalLights: number;
  lightsPerLine: number;
  ampsNeeded: number; // Number of amp lines needed per line
  needsAmp: boolean;
  ampReason: string;
  ampSplicePositions: number[]; // Light numbers where amps should be spliced
  lineResults?: LineResult[]; // New: individual line results
  powerSupply: PowerSupplyInfo; // New: power supply calculations
}