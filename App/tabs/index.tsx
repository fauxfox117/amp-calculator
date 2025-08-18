import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/calculatorStore';
import { calculateAmpRequirement } from '@/utils/calculations';
import colors from '@/constants/colors';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import { LightingSystem, CalculationResult } from '@/types/calculator';

export default function HomeScreen() {
  const addSystem = useAppStore((state) => state.addSystem);
  
  const [systemName, setSystemName] = useState('');
  const [length, setLength] = useState('');
  const [spacing, setSpacing] = useState<'6"' | '9"' | '12"'>('12"');
  const [lineCount, setLineCount] = useState('1');
  const [firstLightDistance, setFirstLightDistance] = useState('');
  const [lightType, setLightType] = useState<'standard' | '3L'>('standard');
  
  const [calculationData, setCalculationData] = useState<CalculationResult | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    const valid = 
      length !== '' && 
      firstLightDistance !== '';
    
    setIsFormValid(valid);
  }, [length, firstLightDistance]);
  
  const handleCalculate = () => {
    if (!isFormValid) return;

    const system: LightingSystem = {
      id: Date.now().toString(),
      name: systemName.trim() || `System ${new Date().toLocaleDateString()}`,
      totalLength: Number(length),
      spacing,
      numberOfLines: Number(lineCount),
      distanceToFirstLight: Number(firstLightDistance),
      date: new Date().toLocaleDateString(),
      lightType,
    };

    const calculationResult = calculateAmpRequirement(system);
    console.log(calculationResult);
    setCalculationData(calculationResult);
  };
  
  const saveSystem = () => {
    if (!calculationData || !isFormValid) return;
    
    const system: LightingSystem = {
      id: Date.now().toString(),
      name: systemName.trim() || `System ${new Date().toLocaleDateString()}`,
      totalLength: Number(length),
      spacing,
      numberOfLines: Number(lineCount),
      distanceToFirstLight: Number(firstLightDistance),
      date: new Date().toLocaleDateString(),
      lightType,
    };
    
    addSystem(system);
    Alert.alert('Success', 'System saved successfully');
  };
  
  const resetForm = () => {
    setSystemName('');
    setLength('');
    setSpacing('12"');
    setLineCount('1');
    setFirstLightDistance('');
    setLightType('standard');
    setCalculationData(null);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Trimlight Amp Calculator</Text>
          <Text style={styles.subtitle}>
            Calculate amp lines needed for your lighting system
          </Text>
          
          <View style={styles.form}>
            <InputField
              label="System Name (Optional)"
              value={systemName}
              onChangeText={setSystemName}
              placeholder="e.g., Kitchen Lighting"
            />
            
            <View style={styles.lightTypeContainer}>
              <Text style={styles.lightTypeLabel}>Light Type</Text>
              <View style={styles.lightTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.lightTypeButton,
                    lightType === 'standard' && styles.lightTypeButtonActive
                  ]}
                  onPress={() => setLightType('standard')}
                >
                  <Text style={[
                    styles.lightTypeButtonText,
                    lightType === 'standard' && styles.lightTypeButtonTextActive
                  ]}>
                    Standard
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.lightTypeButton,
                    lightType === '3L' && styles.lightTypeButtonActive
                  ]}
                  onPress={() => setLightType('3L')}
                >
                  <Text style={[
                    styles.lightTypeButtonText,
                    lightType === '3L' && styles.lightTypeButtonTextActive
                  ]}>
                    3L
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.spacingContainer}>
              <Text style={styles.spacingLabel}>Light Spacing</Text>
              <View style={styles.spacingSelector}>
                <TouchableOpacity
                  style={[
                    styles.spacingButton,
                    spacing === '6"' && styles.spacingButtonActive
                  ]}
                  onPress={() => setSpacing('6"')}
                >
                  <Text style={[
                    styles.spacingButtonText,
                    spacing === '6"' && styles.spacingButtonTextActive
                  ]}>
                    6"
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.spacingButton,
                    spacing === '9"' && styles.spacingButtonActive
                  ]}
                  onPress={() => setSpacing('9"')}
                >
                  <Text style={[
                    styles.spacingButtonText,
                    spacing === '9"' && styles.spacingButtonTextActive
                  ]}>
                    9"
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.spacingButton,
                    spacing === '12"' && styles.spacingButtonActive
                  ]}
                  onPress={() => setSpacing('12"')}
                >
                  <Text style={[
                    styles.spacingButtonText,
                    spacing === '12"' && styles.spacingButtonTextActive
                  ]}>
                    12"
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <InputField
              label="Total Length"
              value={length}
              onChangeText={setLength}
              keyboardType="numeric"
              placeholder="e.g., 50"
              unit="ft"
            />
            
            <InputField
              label="Number of Lines (Optional)"
              value={lineCount}
              onChangeText={setLineCount}
              keyboardType="numeric"
              placeholder="Default: 1"
            />
            
            <InputField
              label="Distance to First Light"
              value={firstLightDistance}
              onChangeText={setFirstLightDistance}
              keyboardType="numeric"
              placeholder="e.g., 50"
              unit="ft"
            />
            
            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onPress={handleCalculate}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Calculate Amp Lines</Text>
            </TouchableOpacity>
          </View>
          
          {calculationData && (
            <View style={styles.resultSection}>
               <ResultCard result={calculationData} />
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveSystem}
                >
                  <Text style={styles.actionButtonText}>Save System</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.resetButton]}
                  onPress={resetForm}
                >
                  <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  lightTypeContainer: {
    marginBottom: 16,
  },
  lightTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  lightTypeSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  lightTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  lightTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  lightTypeButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  lightTypeButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  spacingContainer: {
    marginBottom: 16,
  },
  spacingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  spacingSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  spacingButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  spacingButtonActive: {
    backgroundColor: colors.primary,
  },
  spacingButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  spacingButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.lightText,
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.success,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: colors.text,
  },
})