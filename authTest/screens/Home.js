import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Importa auth y db desde firebaseConfig

const Home = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });
    } else {
      // Si el usuario no está autenticado, redirige a Login
      navigation.navigate('Login');
    }
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    }).catch(error => {
      console.error("Error al cerrar sesión: ", error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola Mundo</Text>
      {userData && (
        <View>
          <Text>UUID: {auth.currentUser.uid}</Text>
          <Text>Nombre: {userData.nombre}</Text>
          <Text>Apellido: {userData.apellido}</Text>
          <Text>Usuario: {userData.usuario}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Fecha de Nacimiento: {userData.fechaNacimiento}</Text>
        </View>
      )}
      <Button title="Cerrar Sesión" onPress={handleLogout} />
      <Button title="Settings" onPress={() => navigation.replace('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Home;