import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../src/viewmodel/AuthViewModel";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚 StudyMateX</Text>
      <Text style={styles.subtitle}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

<TouchableOpacity
  style={styles.button}
  onPress={async () => {
    try {
      await loginUser(email, password);

      alert("Login Successful");

      router.push("/home");
    } catch (error: any) {
      alert(error.message);
    }
  }}
>
  <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
  onPress={() => router.push("/forgot")}
>
  <Text
    style={{
      textAlign: "center",
      marginTop: 15,
      color: "#5A49B6",
    }}
  >
    Forgot Password?
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F7FB",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
    color: "gray",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4F46E5",
  },
});