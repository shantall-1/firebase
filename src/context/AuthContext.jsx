import { createContext, useContext, useEffect, useState } from "react"
// ⚠️ Nota: Asegúrate de que este path y las exportaciones sean correctas en tu proyecto
import { auth, googleProvider } from "../lib/firebase";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Es crucial que este error se lance si el hook se usa fuera del proveedor
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

// 3. Componente proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // Escuchamos cambios de sesión (login, logout, recarga de página, etc.)
  useEffect(() => {
    // Configuración del listener de Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    // Importante: limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  // --- Funciones de ayuda (para usar en los componentes) ---

  // Registro con email/contraseña

const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "registro", user.uid), {
    uid: user.uid,
    email: user.email,
    creadoEn: new Date(),
  });

  return user;
};

  // Login con email/contraseña
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Login con Google
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  // Enviar correo de reset de contraseña
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Cerrar sesión
  const logout = () => signOut(auth);

  //Empaquetar todas las funciones
  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Mientras Firebase verifica sesión, mostramos un loader con estética rosita */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50">
          <p className="text-pink-600 font-extrabold text-xl animate-pulse">
            <span className="text-3xl mr-2">⏳</span> Cargando sesión...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
   )};