import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { CalculationResult } from '@/types/calculator';

interface ResultCardProps {
  result: CalculationResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  // Check if we have multiple line results
  const hasMultipleLines = result.lineResults && result.lineResults.length > 0;
  
  return (
    <View style={styles.card}>
      <View style={styles.mainResult}>
        <Text style={styles.mainResultLabel}>
          {hasMultipleLines ? 'Total Amp Lines Needed:' : 'Amp Lines Needed Per Line:'}
        </Text>
        <Text style={styles.mainResultValue}>
          {result.ampsNeeded}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      {!hasMultipleLines && (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Lights Per Line:</Text>
            <Text style={styles.value}>{result.lightsPerLine}</Text>
          </View>
        </>
      )}
      
      <View style={styles.row}>
        <Text style={styles.label}>Total Lights:</Text>
        <Text style={styles.value}>{result.totalLights}</Text>
      </View>
      
      <View style={styles.divider} />
       <View style={styles.powerSupplySection}>
        <Text style={styles.powerSupplyTitle}>Suggested Power Supply</Text>
        
        <View style={styles.powerSupplyMain}>
          <Text style={styles.powerSupplyLabel}>Recommended PSU:</Text>
          <Text style={styles.powerSupplyValue}>{result.powerSupply.suggestedPsuWatts}W</Text>
        </View>
        
        <View style={styles.powerSupplyDetails}>
          <View style={styles.powerSupplyRow}>
            <Text style={styles.powerSupplyDetailLabel}>Total Power Draw:</Text>
            <Text style={styles.powerSupplyDetailValue}>{result.powerSupply.totalWatts}W</Text>
          </View>
          
          <View style={styles.powerSupplyRow}>
            <Text style={styles.powerSupplyDetailLabel}>Min PSU (with 25% headroom):</Text>
            <Text style={styles.powerSupplyDetailValue}>{result.powerSupply.minPsuWatts}W</Text>
          </View>
          
          {result.powerSupply.wattsBreakdown.standard && (
            <View style={styles.powerSupplyRow}>
              <Text style={styles.powerSupplyDetailLabel}>Standard Lights:</Text>
              <Text style={styles.powerSupplyDetailValue}>{result.powerSupply.wattsBreakdown.standard.toFixed(1)}W</Text>
            </View>
          )}
          
          {result.powerSupply.wattsBreakdown.threeL && (
            <View style={styles.powerSupplyRow}>
              <Text style={styles.powerSupplyDetailLabel}>3L Lights:</Text>
              <Text style={styles.powerSupplyDetailValue}>{result.powerSupply.wattsBreakdown.threeL.toFixed(1)}W</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.ampStatus}>
        <Text style={styles.ampStatusLabel}>Amplifier Required:</Text>
        <Text style={[
          styles.ampStatusValue, 
          result.needsAmp ? styles.ampRequired : styles.ampNotRequired
        ]}>
          {result.needsAmp ? "YES" : "NO"}
        </Text>
      </View>
      
      <Text style={styles.ampReason}>{result.ampReason}</Text>
      
      {/* Show individual line results if available */}
      {hasMultipleLines && (
        <>
          <View style={styles.divider} />
          <View style={styles.lineResultsSection}>
            <Text style={styles.lineResultsTitle}>Individual Line Results:</Text>
            {result.lineResults!.map((lineResult) => (
              <View key={lineResult.lineNumber} style={styles.lineResultCard}>
                <View style={styles.lineHeader}>
                  <Text style={styles.lineTitle}>Line {lineResult.lineNumber}</Text>
                  <Text style={styles.lineLength}>{lineResult.length}ft</Text>
                </View>
                
                <View style={styles.lineDetails}>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Lights:</Text>
                    <Text style={styles.lineValue}>{lineResult.lightsPerLine}</Text>
                  </View>
                  
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Amps Needed:</Text>
                    <Text style={[
                      styles.lineValue,
                      lineResult.needsAmp ? styles.ampRequired : styles.ampNotRequired
                    ]}>
                      {lineResult.ampsNeeded}
                    </Text>
                  </View>
                </View>
                
                {lineResult.ampSplicePositions.length > 0 && (
                  <View style={styles.lineSpliceSection}>
                    <Text style={styles.lineSpliceTitle}>Amp Positions:</Text>
                    <View style={styles.splicePositions}>
                      {lineResult.ampSplicePositions.map((position, index) => (
                        <View key={index} style={styles.splicePositionSmall}>
                          <Text style={styles.splicePositionTextSmall}>#{position}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
      
      {/* Show single line splice positions if not multiple lines */}
      {!hasMultipleLines && result.ampSplicePositions.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.spliceSection}>
            <Text style={styles.spliceTitle}>Amp Splice Positions:</Text>
            <Text style={styles.spliceSubtitle}>Install amps after these light numbers (40-foot rule applied)</Text>
            <View style={styles.splicePositions}>
              {result.ampSplicePositions.map((position, index) => (
                <View key={index} style={styles.splicePosition}>
                  <Text style={styles.splicePositionText}>Light #{position}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainResult: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainResultLabel: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 4,
  },
  mainResultValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: colors.lightText,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  ampStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  ampStatusLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  ampStatusValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  ampRequired: {
    color: colors.error,
  },
  ampNotRequired: {
    color: colors.success,
  },
  ampReason: {
    fontSize: 14,
    color: colors.lightText,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  spliceSection: {
    marginTop: 8,
  },
  spliceTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  spliceSubtitle: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 12,
  },
  splicePositions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  splicePosition: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  splicePositionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  lineResultsSection: {
    marginTop: 8,
  },
  lineResultsTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  lineResultCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lineTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  lineLength: {
    fontSize: 14,
    color: colors.lightText,
    fontWeight: '500',
  },
  lineDetails: {
    marginBottom: 8,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lineLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  lineValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  lineSpliceSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lineSpliceTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 6,
  },
  splicePositionSmall: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  splicePositionTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  powerSupplySection: {
    marginBottom: 8,
  },
  powerSupplyTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  powerSupplyMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  powerSupplyLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  powerSupplyValue: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  powerSupplyDetails: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  powerSupplyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  powerSupplyDetailLabel: {
    fontSize: 14,
    color: colors.lightText,
    flex: 1,
  },
  powerSupplyDetailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },

});