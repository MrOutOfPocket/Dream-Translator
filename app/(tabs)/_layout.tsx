import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          // Add platform-specific height
          height: Platform.OS === 'ios' ? 88 : 60,
          // Add padding for iOS devices with home indicator
          paddingBottom: Platform.OS === 'ios' ? 28 : 0,
        },
        tabBarActiveTintColor: '#e6e6fa',
        tabBarInactiveTintColor: '#666',
        // Ensure icons are visible
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelStyle: {
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dream Translator',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="cloud" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Dream Diary',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="school" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
