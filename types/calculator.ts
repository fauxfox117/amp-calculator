export interface LightingSystem {
  id: string;
  name: string;
  totalLength: number;
  spacing: '6"' | '9"' | '12"';
  numberOfLines: number;
  distanceToFirstLight: number;
  date: string;
  lightType: 'standard' | '3L'| 'globe' | 'soffit';
}

export interface CalculationResult {
  totalLights: number;
  lightsPerLine: number;
  ampsNeeded: number; // Number of amp lines needed per line
  needsAmp: boolean;
  ampReason: string;
}