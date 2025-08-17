import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { CalculationResult } from '../types/calculator';

interface CalculationDisplayProps {
  result: CalculationResult;
}

export default function CalculationDisplay({ result }: CalculationDisplayProps) {
  return (
    <View style={styles.card}>
      <View style={styles.mainResult}>
        <Text style={styles.mainResultLabel}>Amp Lines Needed Per Line:</Text>
        <Text style={styles.mainResultValue}>
          {result.ampsNeeded}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.label}>Lights Per Line:</Text>
        <Text style={styles.value}>{result.lightsPerLine}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Total Lights:</Text>
        <Text style={styles.value}>{result.totalLights}</Text>
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
});