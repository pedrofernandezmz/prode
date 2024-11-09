import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient 
          style={styles.rectangleLineargradient} 
          locations={[0.28, 1]} 
          colors={['rgba(255, 249, 249, 0.1)', 'rgba(0, 0, 0, 0.2)']} 
        />
      <Image
        style={styles.image}
        source={require('@/assets/images/logoprode.png')}
      />
        </View>
      <TouchableOpacity style={styles.option}>
        <Icon name="person-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="notifications-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Notificaciones</Text>
      </TouchableOpacity>

      <View style={[styles.option, styles.option]}>
        <Icon name="sunny-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Modo Oscuro</Text>
        <Switch style={styles.switch} value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.option}>
        <Icon name="star-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Calificar App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="share-social-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Compartir App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="lock-closed-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Política de Privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="document-text-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Términos y Condiciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="mail-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Contacto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="chatbubble-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.logoutOption]}>
        <Icon name="log-out-outline" size={20} color="red" />
        <Text style={[styles.optionText, styles.logoutText]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rectangleLineargradient: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: "100%",
    height: 110,
    position: 'absolute',
  },
  gradientContainer: {
    backgroundColor: '#004A79',
    width: '100%',
    height: 70,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#f5f5f5',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 8,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  darkModeOption: {
    justifyContent: 'space-between',
  },
  logoutOption: {
    borderColor: 'red',
  },
  logoutText: {
    color: 'red',
  },
  switch: {
    position: 'absolute',
    right: 16,
  },
  image: {
    width: 35,
    height: 55,
    marginLeft: 190,
  },
});
