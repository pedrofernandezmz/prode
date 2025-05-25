import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const SignUp = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    // Verificar si el usuario es mayor de 18 años
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimientoDate.getMonth();
    const diaNacimiento = fechaNacimientoDate.getDate();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }

    if (edad < 18) {
      Alert.alert("Error", "Debes ser mayor de 18 años para registrarte.");
      return;
    }

    // Verificar si el nombre de usuario ya existe
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("usuario", "==", usuario));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      Alert.alert("Error", "El nombre de usuario ya está en uso.");
      return;
    }

    try {
      // Verificar si el correo electrónico ya está en uso
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellido,
        usuario,
        email,
        fechaNacimiento,
      });

      console.log('Usuario registrado y datos guardados en Firestore');
      navigation.replace('Home');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "El correo electrónico ya está en uso.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/icons/logoprode.png')}/>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Regístrate!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.subtitle}>¿Ya tienes una cuenta?  <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Inicia Sesión</Text></Text>
          </TouchableOpacity>
          <View style={styles.inputNames}>
            <View style={styles.name}>
              <Text style={styles.inputTitle}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>
              <View style={styles.lastname}>
              <Text style={styles.inputTitle}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
              />
            </View>
          </View>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electronico"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.inputTitle}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="yyyy-mm-dd"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />
          <Text style={styles.inputTitle}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario"
            value={usuario}
            onChangeText={setUsuario}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Contraseña</Text>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Image
                source={
                  showPassword
                    ? require('../assets/icons/visibility_off.png')
                    : require('../assets/icons/visibility.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="•••••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    margin: 10,
    resizeMode: "contain"
  },
  loginContainer: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "90%",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignSelf: 'center',

    // iOS
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,

    // Android
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#6c7278",
  },
  link: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#4d81e7",
  },
  inputContainer: {
    flexDirection: "row",
  },
  inputTitle: {
    fontSize: 16,
    color: "#6c7278",
    marginBottom: 5,
    marginRight: 5,
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    width: "48%",
  },
  lastname: {
    width: "48%",
  },
  icon: {
    width: 25,
    height: 25,
  },
  loginButton: {
    backgroundColor: '#004A79',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Inter-SemiBold",
    color: "#fff"
  },
});

export default SignUp;