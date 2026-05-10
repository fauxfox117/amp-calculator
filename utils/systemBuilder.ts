import { LightingSystem, LineData } from '../types/calculator';

type BuildLightingSystemArgs = {
  name: string;
  totalLength: string;
  lineLengths: string[];
  spacing: '6"' | '9"' | '12"';
  lineCount: string;
  firstLightDistance: string;
  lightType: 'residential' | '3L';
  id?: string;
  date?: string;
};

export function buildLightingSystemFromForm({
  name,
  totalLength,
  lineLengths,
  spacing,
  lineCount,
  firstLightDistance,
  lightType,
  id = Date.now().toString(),
  date = new Date().toLocaleDateString(),
}: BuildLightingSystemArgs): LightingSystem {
  const parsedLineCount = Number(lineCount);

  if (parsedLineCount > 1) {
    const lines: LineData[] = lineLengths.map((length, index) => ({
      id: `line-${index + 1}`,
      length: Number(length),
      distanceToFirstLight: Number(firstLightDistance),
      spacing,
    }));

    const total = lineLengths.reduce((accumulator, length) => accumulator + Number(length), 0);

    return {
      id,
      name,
      totalLength: total,
      spacing,
      numberOfLines: parsedLineCount,
      distanceToFirstLight: Number(firstLightDistance),
      date,
      lines,
      lightType,
    };
  }

  const lines: LineData[] = [{
    id: 'line-1',
    length: Number(totalLength),
    distanceToFirstLight: Number(firstLightDistance),
    spacing,
  }];

  return {
    id,
    name,
    totalLength: Number(totalLength),
    spacing,
    numberOfLines: 1,
    distanceToFirstLight: Number(firstLightDistance),
    date,
    lines,
    lightType,
  };
}