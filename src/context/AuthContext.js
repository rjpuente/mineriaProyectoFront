import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);

  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('userToken', token);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  const restoreToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
  };

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
