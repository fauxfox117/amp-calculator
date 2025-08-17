import { CalculationResult, LightingSystem } from '../types/calculator';

export function calculateLightsFromLength(length: number, spacing: '6"' | '9"' | '12"'): number {
  // Each piece of trim is 7.7' long
  // 12" spacing has 8 lights per 7.7'
  // 9" spacing has 10 lights per 7.7'
  // 6" spacing has 16 lights per 7.7'
  
  const lightsPerSection = spacing === '12"' ? 8 : spacing === '9"' ? 10 : 16;
  const sectionLength = 7.7;
  
  // Calculate how many full sections fit in the length
  const sections = length / sectionLength;
  
  // Calculate total lights (round up to account for partial sections)
  return Math.ceil(sections * lightsPerSection);
}

export function calculateAmpRequirement(system: LightingSystem): CalculationResult {
  // Calculate lights per line based on length and spacing
  const lightsPerLine = calculateLightsFromLength(system.totalLength, system.spacing);
  
  const totalLights = lightsPerLine * system.numberOfLines;
  
  // Calculate amp lines needed per line based on light type
  let ampLinesNeeded = 0;
  let needsAmp = false;
  let ampReason = "";
  
  if (system.lightType === 'standard') {
    // Standard lights: 1 amp line per 100 lights
    ampLinesNeeded = Math.ceil(lightsPerLine / 100);
    needsAmp = lightsPerLine > 100;
    
    if (needsAmp) {
      ampReason = `Standard lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} amp line${ampLinesNeeded > 1 ? 's' : ''} (1 amp per 100 lights)`;
    } else {
      ampReason = "Standard lighting with 100 or fewer lights per line - no amp line needed";
    }
  } else {
    // 3L lights: 1 amp line per 50 lights
    ampLinesNeeded = Math.ceil(lightsPerLine / 70);
    needsAmp = lightsPerLine > 70;
    
    if (needsAmp) {
      ampReason = `3L lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} amp line${ampLinesNeeded > 1 ? 's' : ''} (1 amp per 50 lights)`;
    } else {
      ampReason = "3L lighting with 50 or fewer lights per line - no amp line needed";
    }
  }
  
  // Add note about multiple lines being calculated separately
  if (system.numberOfLines > 1) {
    ampReason += `. Each of your ${system.numberOfLines} lines is calculated separately`;
  }
  
  return {
    totalLights,
    lightsPerLine,
    ampsNeeded: ampLinesNeeded,
    needsAmp,
    ampReason,
  };
}