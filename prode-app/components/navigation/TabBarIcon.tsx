import React from 'react';
import { SvgProps } from 'react-native-svg'; // Importa tipos de props de SVG si usas TypeScript

// Componente TabBarIcon para usar SVGs personalizados
export function TabBarIcon({
  ActiveIcon,
  InactiveIcon,
  focused,
}: {
  ActiveIcon: React.FC<SvgProps>;
  InactiveIcon: React.FC<SvgProps>;
  focused: boolean;
}) {
  const Icon = focused ? ActiveIcon : InactiveIcon; // Selecciona el ícono basado en `focused`

  return <Icon width={32} height={32} />; // No se aplica 'fill' para mantener el color original
}


