import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

// Importa tus SVGs activos e inactivos
import HomeIconInactive from '@/assets/icons/home.svg';
import HomeIconActive from '@/assets/icons/home-selected.svg';
import NewsIconInactive from '@/assets/icons/news.svg';
import NewsIconActive from '@/assets/icons/news-selected.svg';
import ProdeIconInactive from '@/assets/icons/prode.svg';
import ProdeIconActive from '@/assets/icons/prode-selected.svg';
import SettingsIconInactive from '@/assets/icons/settings.svg';
import SettingsIconActive from '@/assets/icons/settings-selected.svg';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#004a79', // Color del texto activo
        tabBarInactiveTintColor: '#737373', // Color del texto inactivo
        tabBarLabelStyle: {
          fontSize: 10, // Tamaño del texto
          fontWeight: 'bold', // Peso de la fuente
        },
        tabBarStyle: {
          paddingBottom: 2, // Ajusta el espacio en la parte inferior si es necesario
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            focused ? <HomeIconActive width={32} height={32} fill={color} /> : <HomeIconInactive width={32} height={32} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Noticias',
          tabBarIcon: ({ color, focused }) => (
            focused ? <NewsIconActive width={32} height={32} fill={color} /> : <NewsIconInactive width={32} height={32} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prode"
        options={{
          title: 'Prode',
          tabBarIcon: ({ color, focused }) => (
            focused ? <ProdeIconActive width={32} height={32} fill={color} /> : <ProdeIconInactive width={32} height={32} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Usuario',
          tabBarIcon: ({ color, focused }) => (
            focused ? <SettingsIconActive width={32} height={32} fill={color} /> : <SettingsIconInactive width={32} height={32} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
