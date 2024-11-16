import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token);
        setMessage("Login exitoso");
        navigation.navigate("MyFeed");
      } else {
        setMessage(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setMessage("Error en el servidor");
      console.error("Error en la autenticación:", error);
    }
  };

//   const goToSignUp = () => {
//     navigation.navigate("SignUp");
//   };

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Ratagram</Text>
      <Text style={styles.labels}>Email</Text>
      <TextInput
        style={styles.inputLandS}
        placeholder="Introduce tu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.labels}>Password</Text>
      <TextInput
        style={styles.inputLandS}
        placeholder="Introduce tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.loginButtonSection}>
        <TouchableOpacity
          style={styles.loginAndSignUpBtn}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginAndSignUpBtn} onPress={goToSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  labels: {
    color: "#202020",
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  inputLandS: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  loginButtonSection: {
    width: "90%",
    height: 100,
    justifyContent: "space-around",
    alignItems: "center",
  },
  loginAndSignUpBtn: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#BD61DE",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
  },
});
