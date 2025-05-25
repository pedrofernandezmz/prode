import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Importa auth y db desde firebaseConfig

const Settings = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    }).catch(error => {
      console.error("Error al cerrar sesión: ", error);
    });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/icons/logoprode.png')}
      />
      <TouchableOpacity style={styles.option}>
        <Icon name="person-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Icon name="notifications-outline" size={20} color="#000" />
        <Text style={styles.optionText}>Notificaciones</Text>
      </TouchableOpacity>

      <View style={styles.option}>
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

      <TouchableOpacity style={styles.option}>
        <Icon name="log-out-outline" size={20} color="red" />
        <Text style={[styles.optionText, styles.logoutText]} onPress={handleLogout} >Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    margin: 10,
    resizeMode: "contain"
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  switch: {
    marginLeft: 'auto',
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Settings;