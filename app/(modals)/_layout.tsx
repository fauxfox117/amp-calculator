import React from 'react';
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          presentation: 'modal',
          headerTitle: 'Saved Systems'
        }} 
      />
    </Stack>
  );
}