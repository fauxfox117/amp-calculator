import { CalculationResult, LightingSystem, LineResult, PowerSupplyInfo } from '../types/calculator';

export function calculateLightsFromLength(length: number, spacing: '6"' | '9"' | '12"', lightType: 'Residential' | '3L' | 'globe' | 'soffit'): number {
// ==========================================================
        //OLD LOGIC BELOW THIS LINE//
// ==========================================================
{

  // // For globe and soffit lights, spacing doesn't apply - calculate based on light type
  // if (lightType === 'globe') {
  //   // Globe lights: approximately 1 light per 2 feet
  //   return Math.ceil(length / 2);
  // }
  
  // if (lightType === 'soffit') {
  //   // Soffit lights: approximately 1 light per 1.5 feet
  //   return Math.ceil(length / 1.5);
  // }
  
  // // For Residential and 3L lights, use spacing-based calculation
  // // Each piece of trim is 7.7' long
  // // 12" spacing has 8 lights per 7.7'
  // // 9" spacing has 10 lights per 7.7'
  // // 6" spacing has 16 lights per 7.7'
  
  // const lightsPerSection = spacing === '12"' ? 8 : spacing === '9"' ? 10 : 16;
  // const sectionLength = 7.7;
  
  // // Calculate how many full sections fit in the length
  // const sections = length / sectionLength;   
};
  // ==========================================================
        //UPDATED LOGIC BELOW THIS LINE//
  // ==========================================================


  // // Calculate total lights (round up to account for partial sections)
  // return Math.ceil(sections * lightsPerSection);
  // Use the new logic from the power supply requirements
  // 6" spacing: lights = feet × 2
  // 9" spacing: lights = feet × 1.33
  // 12" spacing: lights = feet × 1
  
  let lightsPerFoot: number;
  switch (spacing) {
    case '6"':
      lightsPerFoot = 2;
      break;
    case '9"':
      lightsPerFoot = 1.33;
      break;
    case '12"':
      lightsPerFoot = 1;
      break;
    default:
      lightsPerFoot = 1;
  }
  
  return Math.ceil(length * lightsPerFoot);
}

export function calculatePowerSupply(totalLights: number, lightType: 'Residential' | '3L' | 'globe' | 'soffit'): PowerSupplyInfo {
  let totalWatts = 0;
  const wattsBreakdown: PowerSupplyInfo['wattsBreakdown'] = {};
  
  // Calculate watts based on light type
  if (lightType === 'Residential') {
    const ResidentialWatts = totalLights * 0.6;
    wattsBreakdown.Residential = ResidentialWatts;
    totalWatts += ResidentialWatts;
  } else if (lightType === '3L') {
    const threeLWatts = totalLights * 0.72;
    wattsBreakdown.threeL = threeLWatts;
    totalWatts += threeLWatts;
  } else if (lightType === 'globe') {
    const globeWatts = totalLights * 0.8; // Assuming globe lights use 0.8W each
    wattsBreakdown.globe = globeWatts;
    totalWatts += globeWatts;
  } else if (lightType === 'soffit') {
    // Soffit lights might use similar wattage to Residential
    const ResidentialWatts = totalLights * 0.6;
    wattsBreakdown.Residential = ResidentialWatts;
    totalWatts += ResidentialWatts;
  }
  
  // Add 25% headroom for minimum PSU size
  const minPsuWatts = Math.ceil(totalWatts * 1.25);
  
  // Maximum single PSU size is 500W
  const maxSinglePsuWatts = 500;

  // PSU sizes available: 50W, 100W, 200W, 350W, 500W
  const commonPsuSizes = [50, 100, 200, 350, 500];

  let suggestedPsuWatts: number;
  let needsSecondaryPsu = false;
  let secondaryPsuWatts: number | undefined;
  let psuRecommendation: string;
  
  if (minPsuWatts <= maxSinglePsuWatts) {
    // Single PSU can handle the load
    suggestedPsuWatts = commonPsuSizes.find(size => size >= minPsuWatts) || maxSinglePsuWatts;
    psuRecommendation = `Single ${suggestedPsuWatts}W power supply recommended`;
  } else {
    // Need multiple PSUs
    needsSecondaryPsu = true;
    suggestedPsuWatts = maxSinglePsuWatts; // Primary PSU at max size
    
    // Calculate remaining watts for secondary PSU
    const remainingWatts = minPsuWatts - maxSinglePsuWatts;
    secondaryPsuWatts = commonPsuSizes.find(size => size >= remainingWatts) || remainingWatts;
    
    psuRecommendation = `Primary: ${suggestedPsuWatts}W PSU + Secondary: ${secondaryPsuWatts}W PSU required (Total load: ${minPsuWatts}W exceeds single PSU maximum of ${maxSinglePsuWatts}W)`;
  }
  
  return {
    totalWatts: Math.round(totalWatts * 100) / 100, // Round to 2 decimal places
    minPsuWatts,
    suggestedPsuWatts,
    needsSecondaryPsu,
    secondaryPsuWatts,
    psuRecommendation,
    wattsBreakdown,
  };
}

function calculateLineAmpRequirement(
  lineNumber: number,
  length: number,
  spacing: '6"' | '9"' | '12"',
  lightType: 'Residential' | '3L' | 'globe' | 'soffit'
): LineResult {
  const lightsPerLine = calculateLightsFromLength(length, spacing, lightType);
  
  let ampLinesNeeded = 0;
  let needsAmp = false;
  let lightsPerAmp = 0;
  
  if (lightType === 'Residential') {
    lightsPerAmp = 100;
    needsAmp = lightsPerLine > lightsPerAmp;
  } else if (lightType === '3L') {
    lightsPerAmp = 70;
    needsAmp = lightsPerLine > 70;
  }
  
  // Calculate amp splice positions with 40-light rule
  const ampSplicePositions: number[] = [];
  if (needsAmp) {
    const positions: number [] = [];
    
    if (lightType === '3L') {
      // 3L specific logic based on light count
      if (lightsPerLine > 40 && lightsPerLine <= 80) {
        // place one amp at midpoint
        positions.push(Math.floor(lightsPerLine / 2));
      } else if (lightsPerLine > 80 && lightsPerLine <= 110) {
        // place 1 amp exactly 40 lights from the end
        positions.push(lightsPerLine - 40);
      } else if (lightsPerLine > 110) {
        // Place 1 amp 40 lights from the end
        positions.push(lightsPerLine - 40);
        
        // Calculate remaining lights and required amps
        const firstPortion = lightsPerLine - 40;
        const numSegments = Math.ceil(firstPortion / 70);

        // Evenly distribute amp positions in the remaining portion
        for (let i = 1; i < numSegments; i++) {
          const ampPosition = Math.floor((firstPortion / numSegments) * i);
          positions.unshift(ampPosition); // Add to beginning of array
        }
      }
    } else if (lightType === 'Residential') {
      // Residential lights: every 100 lights
      for (let i = 100; i < lightsPerLine; i += 100) {
        positions.push(i);
      }
    }

    ampSplicePositions.push(...positions.sort((a, b) => a - b));
  }

  // Calculate actual number of amps needed based on positions
  ampLinesNeeded = ampSplicePositions.length;

  // Calculate strings needed based on lights per line
  const stringsNeeded = Math.ceil(lightsPerLine / 20);

  return {
    lineNumber,
    length,
    lightsPerLine,
    ampsNeeded: ampLinesNeeded,
    needsAmp,
    ampSplicePositions,
    stringsNeeded,
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
    const lightTypeText = system.lightType === 'Residential' ? 'Residential' : '3L';
    const ampReason = `${lightTypeText} lighting system with ${system.numberOfLines} lines requiring ${totalAmpsNeeded} total amp lines`;
    const powerSupply = calculatePowerSupply(totalLights, system.lightType);
  
    return {
      totalLights,
      lightsPerLine: 0, // Not applicable for multiple lines
      ampsNeeded: totalAmpsNeeded,
      needsAmp: anyLineNeedsAmp,
      ampReason,
      ampSplicePositions: [], // Not applicable for multiple lines
      lineResults,
      powerSupply,
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

    if (system.lightType === 'Residential') {
      lightsPerAmp = 100;
      needsAmp = lightsPerLine > 100;
    } else if (system.lightType === '3L') {
      lightsPerAmp = 70;
      needsAmp = lightsPerLine > 70; // 3L needs amp if >70 lights
    }
    
    // Calculate amp splice positions based on light count and 3L capacity rules
    const ampSplicePositions: number[] = [];
    if (needsAmp) {
      const positions: number[] = [];
      
      if (system.lightType === '3L') {
        // 3L specific logic based on light count
        if (lightsPerLine > 40 && lightsPerLine <= 80) {
          // Place 1 amp at midpoint
          positions.push(Math.floor(lightsPerLine / 2));
        } else if (lightsPerLine > 80 && lightsPerLine <= 110) {
          // Place 1 amp exactly 40 lights from the end
          positions.push(lightsPerLine - 40);
        } else if (lightsPerLine > 110) {
          // Place 1 amp 40 lights from the end
          positions.push(lightsPerLine - 40);
          
          // Calculate remaining lights and required amps
          const firstPortion = lightsPerLine - 40;
          const numSegments = Math.ceil(firstPortion / 70);

          // Evenly distribute amp positions in the remaining portion
          for (let i = 1; i < numSegments; i++) {
            const ampPosition = Math.floor((firstPortion / numSegments) * i);
            positions.unshift(ampPosition); // Add to beginning of array
          }
        }
      } else if (system.lightType === 'Residential') {
        // Residential lights: every 100 lights
        for (let i = 100; i < lightsPerLine; i += 100) {
          positions.push(i);
        }
      }
      
      ampSplicePositions.push(...positions.sort((a, b) => a - b));
    }
    
    // Calculate actual number of amps needed based on positions
    ampLinesNeeded = ampSplicePositions.length;
    
    // Create reason text
    if (needsAmp) {
      const lightTypeText = system.lightType === 'Residential' ? 'Residential' : '3L';
      const maxLightsText = system.lightType === 'Residential' ? '100' : '70';
      
      if (ampLinesNeeded > 0) {
        ampReason = `${lightTypeText} lighting with ${lightsPerLine} lights per line requires ${ampLinesNeeded} amp line${ampLinesNeeded > 1 ? 's' : ''} (1 amp per ${maxLightsText} lights + 40-light rule)`;
      } else {
        ampReason = `${lightTypeText} lighting with ${lightsPerLine} lights per line requires amplification, but positioning optimized for 40-light rule`;
      }
    } else {
      const lightTypeText = system.lightType === 'Residential' ? 'Residential' : '3L';
      const maxLightsText = system.lightType === 'Residential' ? '100' : '70';
      ampReason = `${lightTypeText} lighting with ${maxLightsText} or fewer lights per line - no amp line needed`;
    }
    
    // Add note about multiple lines being calculated separately
    if (system.numberOfLines > 1) {
      ampReason += `. Each of your ${system.numberOfLines} lines is calculated separately`;
    }

    // Calculate power supply requirements
    const powerSupply = calculatePowerSupply(totalLights, system.lightType);
    
    return {
      totalLights,
      lightsPerLine,
      ampsNeeded: ampLinesNeeded,
      needsAmp,
      ampReason,
      ampSplicePositions,
      powerSupply,
    };
  }
}