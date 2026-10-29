/**
 * Conexion con Firebase para Androi e IOS.
 * Expo elige este archivo en el movil
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApp, getApps, initializeApp} from 'firebase/app'
import {Auth, getAuth, getReactNativePersistence,initializeAuth} from 'firebase/auth';

//Los valores vienen del archivo .env.local. Expo solo expone a la app 
//las variables que empiezan con EXPO_PUBLIC_.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Con la recarga rapida (Fast Refresh) este módulo se puede ejecutar más de
// una vez. getApps() evita el error "Firebase App named '[DEFAULT]' already exists".
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
 
// initializeAuth solo se puede llamar una vez por app. Si ya existe, lo reutilizamos.
function crearAuth(): Auth {
  try {
    // getReactNativePersistence guarda la sesión en AsyncStorage: así el
    // estudiante sigue conectado aunque cierre la app. Sin esto, la sesión
    // vive solo en memoria y se pierde al reiniciar.
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}
 
export const auth = crearAuth();
 
// Los correos de recuperacion de contraseña llegarán en español.
auth.languageCode = 'es';
