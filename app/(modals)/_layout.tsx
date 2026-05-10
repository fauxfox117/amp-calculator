import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';

const APP_MAX_WIDTH = 980;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          width: '100%',
          maxWidth: APP_MAX_WIDTH,
          alignSelf: 'center',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.lightText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          width: '100%',
          maxWidth: APP_MAX_WIDTH,
          alignSelf: 'center',
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        headerTitle:"Amp Calculator",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Amp Calculator",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Saved Systems",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}