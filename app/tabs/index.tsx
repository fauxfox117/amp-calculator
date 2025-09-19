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
import { LightingSystem, CalculationResult, LineData } from '@/types/calculator';

export default function HomeScreen() {
  const addSystem = useAppStore((state) => state.addSystem);
  
  const [systemName, setSystemName] = useState('');
  const [calculationData, setCalculationData] = useState<CalculationResult | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [totalLength, setTotalLength] = useState('');
  const [lineLengths, setLineLengths] = useState<string[]>([]);
  const [spacing, setSpacing] = useState<'6"' | '9"' | '12"'>('12"');
  const [lineCount, setLineCount] = useState('1');
  const [firstLightDistance, setFirstLightDistance] = useState('');
  const [lightType, setLightType] = useState<'residential' | '3L'>('residential');
  
  useEffect(() => {
    let valid = false;
    if (Number(lineCount) > 1) {
      valid = lineLengths.length === Number(lineCount) && lineLengths.every(l => l !== '') && firstLightDistance !== '';
    } else {
      valid = totalLength !== '' && firstLightDistance !== '';
    }
    setIsFormValid(valid);
  }, [totalLength, lineLengths, lineCount, firstLightDistance]);
  
  const handleCalculate = () => {
    if (!isFormValid) return;

    let system: LightingSystem;
    if (Number(lineCount) > 1) {
      // Create individual line data for each line
      const lines: LineData[] = lineLengths.map((length, index) => ({
        id: `line-${index + 1}`,
        length: Number(length),
        distanceToFirstLight: Number(firstLightDistance),
        spacing
      }));
      const total = lineLengths.reduce((acc, l) => acc + Number(l), 0);
      system = {
        id: Date.now().toString(),
        name: systemName.trim() || `System ${new Date().toLocaleDateString()}`,
        totalLength: total,
        spacing,
        numberOfLines: Number(lineCount),
        distanceToFirstLight: Number(firstLightDistance),
        date: new Date().toLocaleDateString(),
        lines, // ADD THIS LINE!
        lightType,
      };
    } else {
      const lines: LineData[] = [{
        id: 'line-1',
        length: Number(totalLength),
        distanceToFirstLight: Number(firstLightDistance),
        spacing
      }];
      
      system = {
        id: Date.now().toString(),
        name: systemName.trim(),
        totalLength: Number(totalLength),
        spacing,
        numberOfLines: 1,
        distanceToFirstLight: Number(firstLightDistance),
        date: new Date().toLocaleDateString(),
        lines, // ADD THIS LINE
        lightType,
      };
    }
    const calculationResult = calculateAmpRequirement(system);
    setCalculationData(calculationResult);
  };
  
  const saveSystem = () => {
    if (!calculationData || !isFormValid) return;
    
    // Check if system name is empty
    if (!systemName.trim()) {
      Alert.alert(
        'System Name Required',
        'Please enter a name for the system before saving.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    let system: LightingSystem;
    
    if (Number(lineCount) > 1) {
      // Create individual line data for each line
       const lines: LineData[] = lineLengths.map((length, index) => ({
        id: `line-${index + 1}`,
        length: Number(length),
        distanceToFirstLight: Number(firstLightDistance),
        spacing
      }));
      
      const total = lineLengths.reduce((acc, l) => acc + Number(l), 0);

      system = {
        id: Date.now().toString(),
        name: systemName.trim(),  // Remove the fallback default name
        totalLength: total,
        spacing,
        numberOfLines: Number(lineCount),
        distanceToFirstLight: Number(firstLightDistance),
        date: new Date().toLocaleDateString(),
        lines, // Add individual line data
        lightType,
      };
    } else {
      system = {
        id: Date.now().toString(),
        name: systemName.trim(),  // Remove the fallback default name
        totalLength: Number(totalLength),
        spacing,
        numberOfLines: 1,
        distanceToFirstLight: Number(firstLightDistance),
        date: new Date().toLocaleDateString(),
        lightType,
      };
    }
    addSystem(system);
    Alert.alert('Success', 'System saved successfully');
    resetForm();
  };
  
  const resetForm = () => {
  setSystemName('');
  setTotalLength('');
  setLineLengths([]);
  setSpacing('12"');
  setLineCount('1');
  setFirstLightDistance('');
  setLightType('residential');
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
          <Text style={styles.title}>Amp Calculator</Text>
          <Text style={styles.subtitle}>
            Calculate amp lines needed for your lighting system
          </Text>
          
          <View style={styles.form}>
            <InputField
              label="System Name (Required)"
              value={systemName}
              onChangeText={setSystemName}
              placeholder="e.g., Client's name"
            />
            
            <View style={styles.lightTypeContainer}>
              <Text style={styles.lightTypeLabel}>Light Type</Text>
              <View style={styles.lightTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.lightTypeButton,
                    lightType === 'residential' && styles.lightTypeButtonActive
                  ]}
                  onPress={() => setLightType('residential')}
                >
                  <Text style={[
                    styles.lightTypeButtonText,
                    lightType === 'residential' && styles.lightTypeButtonTextActive
                  ]}>
                    Residential
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
              

              {/*below are soffit(puck/downlights) and globe lights, 
              logic pending so, commented out until logic is proven */}


              {/* <View style={[styles.lightTypeSelector, { marginTop: 8 }]}>
                <TouchableOpacity
                  style={[
                    styles.lightTypeButton,
                    lightType === 'globe' && styles.lightTypeButtonActive
                  ]}
                  onPress={() => setLightType('globe')}
                >
                  <Text style={[
                    styles.lightTypeButtonText,
                    lightType === 'globe' && styles.lightTypeButtonTextActive
                  ]}>
                    Globe
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.lightTypeButton,
                    lightType === 'soffit' && styles.lightTypeButtonActive
                  ]}
                  onPress={() => setLightType('soffit')}
                >
                  <Text style={[
                    styles.lightTypeButtonText,
                    lightType === 'soffit' && styles.lightTypeButtonTextActive
                  ]}>
                    Soffit
                  </Text>
                </TouchableOpacity>
              </View> */}


            </View>
             {/* Only show spacing for residential and 3L lights */}
            {(lightType === 'residential' || lightType === '3L') && (
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
            )}


            {/*below are the options for globe and soffit lights */}

            {/* Show info text for globe and soffit lights */}

            {/* {lightType === 'globe' && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Globe lights are calculated at approximately 1 light per 2 feet
                </Text>
              </View>
            )}
            
            {lightType === 'soffit' && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Soffit lights are calculated at approximately 1 light per 1.5 feet
                </Text>
              </View>
            )} */}
            
            <InputField
              label="Number of Lines"
              value={lineCount}
              onChangeText={text => {
                // Allow empty string or numbers 1-9
                if (text === '' || (parseInt(text) >= 1 && parseInt(text) <= 9)) {
                  setLineCount(text);
                  const count = parseInt(text) || 0;
                  if (count > 1) {
                    setLineLengths(Array(count).fill(''));
                  } else {
                    setLineLengths([]);
                  }
                }
              }}
              keyboardType="numeric"
              placeholder="Default: 1 (Max: 9)"
            />

            
            {Number(lineCount) > 1 ? (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '500', marginBottom: 8 }}>Length of Each Line</Text>
                {lineLengths.map((val, idx) => (
                  <InputField
                    key={idx}
                    label={`Line ${idx + 1} Length`}
                    value={val}
                    onChangeText={text => {
                      const newArr = [...lineLengths];
                      newArr[idx] = text;
                      setLineLengths(newArr);
                    }}
                    keyboardType="numeric"
                    placeholder={`e.g., 50`}
                    unit="ft"
                  />
                ))}
              </View>
            ) : (
              <InputField
                label="Total Length"
                value={totalLength}
                onChangeText={setTotalLength}
                keyboardType="numeric"
                placeholder="e.g., 50"
                unit="ft"
              />
            )}
            
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
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.lightText,
    lineHeight: 20,
  },
});