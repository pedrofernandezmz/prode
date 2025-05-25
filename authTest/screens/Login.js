import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [userInfo, setUserInfo] = React.useState();
  const [request, response, prompAsync] = Google.useAuthRequest({
    iosClientId: "931737658434-ik40gj1etara2r56ejiqelo0a07m34jr.apps.googleusercontent.com",
    androidClientId: "931737658434-laa91h1rdu28jgft9p59juao41gn6iek.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
    }
  }, [response]);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(Json.stringify(user, null, 2));
        setUserInfo(user);
      } else {
        console.log("User not authenticated");
      }
    });

    return () => unsub();
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario ha iniciado sesión');
        navigation.replace('Home');
      })
      .catch(error => {
        Alert.alert("Error", "Correo electrónico o contraseña incorrectos.");
      });
  };

  const handleForgotPassword = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert("Éxito", "Se ha enviado un correo para restablecer la contraseña.");
        })
        .catch(error => {
          Alert.alert("Error", error.message);
        });
    } else {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico.");
    }


  };



  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/icons/logoprode.png')}/>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.subtitle}>¿No tenés una cuenta?  <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Registrate</Text></Text>
        </TouchableOpacity>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginGoogle} onPress={() => prompAsync()}>
      <View style={styles.buttonContent}>
        <Image style={styles.iconLogo} source={require('../assets/icons/Google.png')}/>
        <Text style={styles.textGoogle}>Continuar con Google</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginFacebook}>
      <View style={styles.buttonContent}>
        <Image style={styles.iconLogo} source={require('../assets/icons/Facebook.png')}/>
        <Text style={styles.textFacebook}>Continuar con Facebook</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginApple}>
      <View style={styles.buttonContent}>
        <Image style={styles.iconLogo} source={require('../assets/icons/Apple.png')}/>
        <Text style={styles.textApple}>Continuar con Apple</Text>
      </View>
      </TouchableOpacity>
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
    borderColor: '#CCC',
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
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Inter-SemiBold",
    color: "#fff"
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loginGoogle: {
    backgroundColor: "#ffff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    flexDirection: 'row',

    // iOS
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,

    // Android
    elevation: 4,
  },
  textGoogle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
    color: "rgba(0, 0, 0, 0.54)",
  },
  loginFacebook: {
    backgroundColor: "#1877f2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    flexDirection: 'row',
    
    // iOS
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,

    // Android
    elevation: 3,
  },
  textFacebook: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Helvetica",
    color: "#fff",
  },
  loginApple: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    flexDirection: 'row',

    // iOS
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,

    // Android
    elevation: 3,
  },
  textApple: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "SF Pro Display",
    color: "#fff"
  },
  iconLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  
});

export default Login;