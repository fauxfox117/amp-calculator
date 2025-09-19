import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { LightingSystem } from '../types/calculator';
import { useAppStore } from '../store/calculatorStore';

interface SystemCardProps {
  system: LightingSystem;
  onPress: () => void;
}

export default function SystemCard({ system, onPress }: SystemCardProps) {
  const removeSystem = useAppStore((state) => state.removeSystem);
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name}>{system.name}</Text>
        <Text style={styles.date}>{system.date}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Light Type</Text>
          <Text style={styles.detailValue}>
            {system.lightType === 'standard' ? 'Standard' : 
             system.lightType === '3L' ? '3L' :
             system.lightType === 'globe' ? 'Globe' : 'Soffit'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Spacing</Text>
          <Text style={styles.detailValue}>{system.spacing}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Length</Text>
          <Text style={styles.detailValue}>{system.totalLength} ft</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Lines</Text>
          <Text style={styles.detailValue}>{system.numberOfLines}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => removeSystem(system.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={18} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.lightText,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});