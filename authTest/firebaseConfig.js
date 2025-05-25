import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7gm68LScelB_eAzJccfhXD5M_1GLTqk0",
  authDomain: "auth-f67f2.firebaseapp.com",
  projectId: "auth-f67f2",
  storageBucket: "auth-f67f2.appspot.com",
  messagingSenderId: "931737658434",
  appId: "1:931737658434:web:9bf855c18342ca1958f9db",
  measurementId: "G-VGN5BY4376",
  databaseURL: "https://auth-f67f2.firebaseio.com",
};

// Verificar si Firebase ya está inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Configura Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };

//IOS: 931737658434-ik40gj1etara2r56ejiqelo0a07m34jr.apps.googleusercontent.com

//ANDROID: 931737658434-laa91h1rdu28jgft9p59juao41gn6iek.apps.googleusercontent.com