import { CalculationResult, LightingSystem } from '../types/calculator';

export function calculateLightsFromLength(length: number, spacing: '6"' | '9"' | '12"', lightType: 'standard' | '3L' | 'globe' | 'soffit'): number {
  // For globe and soffit lights, spacing doesn't apply - calculate based on light type
  if (lightType === 'globe') {
    // Globe lights: approximately 1 light per 2 feet
    return Math.ceil(length / 2);
  }
  
  if (lightType === 'soffit') {
    // Soffit lights: approximately 1 light per 1.5 feet
    return Math.ceil(length / 1.5);
  }
  
  // For standard and 3L lights, use spacing-based calculation
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
  // Calculate lights per line based on length, spacing, and light type
  const lightsPerLine = calculateLightsFromLength(system.totalLength, system.spacing, system.lightType);
  const totalLights = lightsPerLine * system.numberOfLines;

  // Calculate amp lines needed per line based on light type, EXCLUDING the initial power supply
  let ampLinesNeeded = 0;
  let needsAmp = false;
  let ampReason = "";

  if (system.lightType === 'standard') {
    // Standard lights: 1 amp line per 100 lights, but first 100 lights are powered by the initial supply
    ampLinesNeeded = lightsPerLine > 100 ? Math.ceil((lightsPerLine - 100) / 100) : 0;
    needsAmp = lightsPerLine > 100;

    if (needsAmp) {
      ampReason = `Standard lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} additional amp line${ampLinesNeeded > 1 ? 's' : ''} (excluding initial power supply, 1 amp per 100 lights after first 100)`;
    } else {
      ampReason = "Standard lighting with 100 or fewer lights per line - no additional amp line needed";
    }
  } else if (system.lightType === '3L') {
    // 3L lights: 1 amp line per 70 lights, but first 70 lights are powered by the initial supply
    ampLinesNeeded = lightsPerLine > 70 ? Math.ceil((lightsPerLine - 70) / 70) : 0;
    needsAmp = lightsPerLine > 70;

    if (needsAmp) {
      ampReason = `3L lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} additional amp line${ampLinesNeeded > 1 ? 's' : ''} (excluding initial power supply, 1 amp per 70 lights after first 70)`;
    } else {
      ampReason = "3L lighting with 70 or fewer lights per line - no additional amp line needed";
    }
  } else if (system.lightType === 'globe') {
    // Globe lights: 1 amp line per 120 lights, but first 120 lights are powered by the initial supply
    ampLinesNeeded = lightsPerLine > 120 ? Math.ceil((lightsPerLine - 120) / 120) : 0;
    needsAmp = lightsPerLine > 120;

    if (needsAmp) {
      ampReason = `Globe lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} additional amp line${ampLinesNeeded > 1 ? 's' : ''} (excluding initial power supply, 1 amp per 120 lights after first 120)`;
    } else {
      ampReason = "Globe lighting with 120 or fewer lights per line - no additional amp line needed";
    }
  } else if (system.lightType === 'soffit') {
    // Soffit lights: 1 amp line per 80 lights, but first 80 lights are powered by the initial supply
    ampLinesNeeded = lightsPerLine > 80 ? Math.ceil((lightsPerLine - 80) / 80) : 0;
    needsAmp = lightsPerLine > 80;

    if (needsAmp) {
      ampReason = `Soffit lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} additional amp line${ampLinesNeeded > 1 ? 's' : ''} (excluding initial power supply, 1 amp per 80 lights after first 80)`;
    } else {
      ampReason = "Soffit lighting with 80 or fewer lights per line - no additional amp line needed";
    }
  }

  // Add note about multiple lines being calculated separately
  if (system.numberOfLines > 1) {
    ampReason += `. Each of your ${system.numberOfLines} lines is calculated separately.`;
  }

  return {
    totalLights,
    lightsPerLine,
    ampsNeeded: ampLinesNeeded,
    needsAmp,
    ampReason,
  };
}