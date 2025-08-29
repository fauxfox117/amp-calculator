import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { useAppStore } from '@/store/calculatorStore';
import { calculateAmpRequirement } from '@/utils/calculations';
import colors from '@/constants/colors';
import SystemCard from '@/components/SystemCard';
import ResultCard from '@/components/ResultCard';
import { LightingSystem } from '@/types/calculator';

export default function HistoryScreen() {
  const { savedSystems, clearSystems } = useAppStore();
  const [selectedSystem, setSelectedSystem] = useState<LightingSystem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const displaySystems = savedSystems; // Use only real saved systems
  
  const handleSystemPress = (system: LightingSystem) => {
    setSelectedSystem(system);
    setModalVisible(true);
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Systems',
      'Are you sure you want to delete all saved systems?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          onPress: clearSystems,
          style: 'destructive'
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Systems ({displaySystems.length})</Text>
        {displaySystems.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      {displaySystems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved systems yet</Text>
          <Text style={styles.emptySubtext}>
            Calculate and save lighting systems to view them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={displaySystems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SystemCard 
              system={item} 
              onPress={() => handleSystemPress(item)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEnabled={true}
        />
      )}
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSystem?.name}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedSystem && (
                <ResultCard result={calculateAmpRequirement(selectedSystem)} />
              )}
              
              <View style={styles.systemDetails}>
                <Text style={styles.detailsTitle}>System Details</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Light Type:</Text>
                  <Text style={styles.detailValue}>
                    {selectedSystem?.lightType === 'Residential' ? 'Residential' : '3L'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Spacing:</Text>
                  <Text style={styles.detailValue}>{selectedSystem?.spacing}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Length:</Text>
                  <Text style={styles.detailValue}>{selectedSystem?.totalLength} ft</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Number of Lines:</Text>
                  <Text style={styles.detailValue}>{selectedSystem?.numberOfLines}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distance to First Light:</Text>
                  <Text style={styles.detailValue}>{selectedSystem?.distanceToFirstLight} ft</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100, // Add more bottom padding to ensure scrolling works
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    flex: 1,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  systemDetails: {
    marginTop: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.lightText,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});