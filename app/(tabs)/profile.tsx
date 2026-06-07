import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { auth, db } from "../../src/services/firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";

import {
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const userDoc = await getDoc(
        doc(db, "users", uid)
      );

      if (userDoc.exists()) {
        const data = userDoc.data();

        setName(data.name || "");
        setEmail(data.email || "");
        setGoal(data.goal || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      await setDoc(
        doc(db, "users", uid),
        {
          name,
          email,
          goal,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      Alert.alert(
        "Success",
        "Profile Updated Successfully"
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  const changePassword = async () => {
    try {
      if (!email) {
        Alert.alert(
          "Error",
          "Email not found"
        );
        return;
      }

      await sendPasswordResetEmail(
        auth,
        email
      );

      Alert.alert(
        "Success",
        "Password reset email sent"
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        👤 My Profile
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Study Goal"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
      >
        <Text style={styles.buttonText}>
          💾 Save Changes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.passwordButton}
        onPress={changePassword}
      >
        <Text style={styles.buttonText}>
          🔒 Change Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.buttonText}>
          🚪 Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  passwordButton: {
    backgroundColor: "#F59E0B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});