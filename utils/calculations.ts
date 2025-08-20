import { CalculationResult, LightingSystem, LineResult } from '../types/calculator';

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

function calculateLineAmpRequirement(
  lineNumber: number,
  length: number,
  spacing: '6"' | '9"' | '12"',
  lightType: 'standard' | '3L' | 'globe' | 'soffit'
): LineResult {
  const lightsPerLine = calculateLightsFromLength(length, spacing, lightType);
  
  let ampLinesNeeded = 0;
  let needsAmp = false;
  let lightsPerAmp = 0;
  
  if (lightType === 'standard') {
    lightsPerAmp = 100;
    needsAmp = lightsPerLine > lightsPerAmp;
  } else if (lightType === '3L') {
    lightsPerAmp = 70;
    needsAmp = lightsPerLine > lightsPerAmp;
  }
  
  // Calculate amp splice positions with 40-foot rule
  const ampSplicePositions: number[] = [];
  if (needsAmp && lightsPerAmp > 0) {
    // Calculate the distance per light based on spacing
    const spacingInFeet = spacing === '6"' ? 0.5 : spacing === '9"' ? 0.75 : 1.0;
    
    // Calculate how many lights fit in 40 feet
    const lightsIn40Feet = Math.floor(40 / spacingInFeet);
    
    // Start with regular intervals
    const positions: number[] = [];
    for (let i = lightsPerAmp; i < lightsPerLine; i += lightsPerAmp) {
      positions.push(i);
    }
    
    // Check if we need an amp within the last 40 feet
    const lastAmpPosition = positions.length > 0 ? positions[positions.length - 1] : 0;
    const lightsFromLastAmp = lightsPerLine - lastAmpPosition;
    
    // If the distance from the last amp to the end is more than 40 feet worth of lights,
    // we need to add another amp
    if (lightsFromLastAmp > lightsIn40Feet) {
      // Place the additional amp so that it's within 40 feet of the end
      const newAmpPosition = lightsPerLine - lightsIn40Feet;
      
      // Only add if it's not too close to the previous amp (at least 20 lights apart)
      if (positions.length === 0 || newAmpPosition - positions[positions.length - 1] >= 20) {
        positions.push(newAmpPosition);
      } else {
        // If too close, replace the last position
        positions[positions.length - 1] = newAmpPosition;
      }
    }
    
    ampSplicePositions.push(...positions);
  }
  
  // Calculate actual number of amps needed based on positions
  ampLinesNeeded = ampSplicePositions.length;
  
  return {
    lineNumber,
    length,
    lightsPerLine,
    ampsNeeded: ampLinesNeeded,
    needsAmp,
    ampSplicePositions,
  };
}

export function calculateAmpRequirement(system: LightingSystem): CalculationResult {
  // Check if we have individual line data
  if (system.numberOfLines > 1 && system.lines && system.lines.length > 0) {
    // Calculate for each individual line
    const lineResults: LineResult[] = system.lines.map((line, index) => 
      calculateLineAmpRequirement(
        index + 1,
        line.length,
        line.spacing,
        system.lightType
      )
    );
    
    // Calculate totals
    const totalLights = lineResults.reduce((sum, line) => sum + line.lightsPerLine, 0);
    const totalAmpsNeeded = lineResults.reduce((sum, line) => sum + line.ampsNeeded, 0);
    const anyLineNeedsAmp = lineResults.some(line => line.needsAmp);
    
    // Create summary reason
    const lightTypeText = system.lightType === 'standard' ? 'Standard' : '3L';
    const ampReason = `${lightTypeText} lighting system with ${system.numberOfLines} lines requiring ${totalAmpsNeeded} total amp lines`;
    
    return {
      totalLights,
      lightsPerLine: 0, // Not applicable for multiple lines
      ampsNeeded: totalAmpsNeeded,
      needsAmp: anyLineNeedsAmp,
      ampReason,
      ampSplicePositions: [], // Not applicable for multiple lines
      lineResults,
    };
  } else {
    // Single line calculation (existing logic)
    const lightsPerLine = calculateLightsFromLength(system.totalLength, system.spacing, system.lightType);
    const totalLights = lightsPerLine * system.numberOfLines;
    
    // Calculate amp lines needed per line based on light type
    let ampLinesNeeded = 0;
    let needsAmp = false;
    let ampReason = "";
    let lightsPerAmp = 0;
    
    if (system.lightType === 'standard') {
      // Standard lights: 1 amp line per 100 lights
      lightsPerAmp = 100;
      needsAmp = lightsPerLine > lightsPerAmp;
    } else if (system.lightType === '3L') {
      // 3L lights: 1 amp line per 70 lights
      lightsPerAmp = 70;
      needsAmp = lightsPerLine > lightsPerAmp;
    }
    
    // Calculate amp splice positions with 40-foot rule
    const ampSplicePositions: number[] = [];
    if (needsAmp && lightsPerAmp > 0) {
      // Calculate the distance per light based on spacing
      const spacingInFeet = system.spacing === '6"' ? 0.5 : system.spacing === '9"' ? 0.75 : 1.0;
      
      // Calculate how many lights fit in 40 feet
      const lightsIn40Feet = Math.floor(40 / spacingInFeet);
      
      // Start with regular intervals
      const positions: number[] = [];
      for (let i = lightsPerAmp; i < lightsPerLine; i += lightsPerAmp) {
        positions.push(i);
      }
      
      // Check if we need an amp within the last 40 feet
      const lastAmpPosition = positions.length > 0 ? positions[positions.length - 1] : 0;
      const lightsFromLastAmp = lightsPerLine - lastAmpPosition;
      
      // If the distance from the last amp to the end is more than 40 feet worth of lights,
      // we need to add another amp
      if (lightsFromLastAmp > lightsIn40Feet) {
        // Place the additional amp so that it's within 40 feet of the end
        const newAmpPosition = lightsPerLine - lightsIn40Feet;
        
        // Only add if it's not too close to the previous amp (at least 20 lights apart)
        if (positions.length === 0 || newAmpPosition - positions[positions.length - 1] >= 20) {
          positions.push(newAmpPosition);
        } else {
          // If too close, replace the last position
          positions[positions.length - 1] = newAmpPosition;
        }
      }
      
      ampSplicePositions.push(...positions);
    }
    
    // Calculate actual number of amps needed based on positions
    ampLinesNeeded = ampSplicePositions.length;
    
    // Create reason text
    if (needsAmp) {
      const lightTypeText = system.lightType === 'standard' ? 'Standard' : '3L';
      const maxLightsText = system.lightType === 'standard' ? '100' : '70';
      
      if (ampLinesNeeded > 0) {
        ampReason = `${lightTypeText} lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} amp line${ampLinesNeeded > 1 ? 's' : ''} (1 amp per ${maxLightsText} lights + 40-foot rule)`;
      } else {
        ampReason = `${lightTypeText} lighting with ${lightsPerLine} lights per line requires amplification, but positioning optimized for 40-foot rule`;
      }
    } else {
      const lightTypeText = system.lightType === 'standard' ? 'Standard' : '3L';
      const maxLightsText = system.lightType === 'standard' ? '100' : '70';
      ampReason = `${lightTypeText} lighting with ${maxLightsText} or fewer lights per line - no amp line needed`;
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
      ampSplicePositions,
    };
  }
}