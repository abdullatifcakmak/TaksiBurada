import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Bu hesap devre dışı bırakıldı.";
      } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        errorMessage = "Kullanıcı bulunamadı veya bilgiler yanlış.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Yanlış parola.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = "Üyelik başarısız. Lütfen tekrar deneyin.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Bu e-posta adresi zaten kullanımda.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Parola en az 6 karakter olmalı.";
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};