export default {
  // Default values for calculations
  residentialLightWattage: 60, // watts
  threeLLightWattage: 90, // watts for 3L lights
  globeLightWattage: 45, // watts for globe lights
  soffitLightWattage: 75, // watts for soffit lights
  residentialVoltage: 120, // volts
  voltageDrop: 0.05, // 5% voltage drop per 100ft
  safetyFactor: 1.25, // 25% safety margin
  wireGauges: [
    { gauge: 14, maxAmps: 15, resistancePerFt: 0.00307 },
    { gauge: 12, maxAmps: 20, resistancePerFt: 0.00193 },
    { gauge: 10, maxAmps: 30, resistancePerFt: 0.00121 },
    { gauge: 8, maxAmps: 40, resistancePerFt: 0.00076 },
    { gauge: 6, maxAmps: 55, resistancePerFt: 0.00048 },
  ],
};