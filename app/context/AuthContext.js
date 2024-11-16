import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
/**
 * AuthProvider se encargará de proveer la autenticación de los usuarios, es decir, 
determinar si un usuario está autenticado una vez hecho el login.
Para esto, de manera general, AuthProvider se encarga de guardar el token del usuario en el 
SecureStore y setea a ese usuario como autenticado.
Utilizamos el Hook de useContext ya que, al momento de investigar cómo podíamos iniciar el proyecto, 
nos pareció una buena herramienta a utilizar y mantener a lo largo de las diferentes versiones que fuimos construyendo.
Fuentes que utilizamos para entender el funcionamiento de este Hook:https://medium.com/@diego.coder/contextos-en-react-js-hook-usecontext-440b948226e6
https://es.react.dev/reference/react/useContext 
 */

//Creamos el objeto AuthContext
const AuthContext = createContext();

// Este sería nuestro proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    //Creamos este useState para guardar el estado de un usuario autenticado
    const token = SecureStore.getItemAsync("token"); //Tomamos el token del SecureStore
    return !!token; // Los simbolos "!!" nos van a decir si el token existe o no, ya que "token" puede ser ya sea true o false.
  });
  const [user, setUser] = useState(SecureStore.getItemAsync("token"));

  //Aquí es donde se setea el valor de isAuthenticated, dependiendo de si se encontró o no el token en el SecureStore
  useEffect(() => {
    const token = SecureStore.getItemAsync("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    } else {
      setIsAuthenticated(false); // No autenticado si no hay token
    }
  }, [isAuthenticated]);

  console.log("AuthUser", user);
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync("token", token);
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
