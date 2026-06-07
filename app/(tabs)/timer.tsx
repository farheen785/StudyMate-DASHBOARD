import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    addDoc,
    collection,
} from "firebase/firestore";

import { auth, db } from "../../src/services/firebase";

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: any;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const saveSession = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        Alert.alert(
          "Error",
          "User not logged in"
        );
        return;
      }

      if (seconds === 0) {
        Alert.alert(
          "Error",
          "Study for some time first"
        );
        return;
      }

      await addDoc(
        collection(db, "study_sessions"),
        {
          userId: uid,
          duration: seconds,
          date: new Date()
            .toISOString()
            .split("T")[0],
          createdAt: new Date(),
        }
      );

      await addDoc(
        collection(db, "activities"),
        {
          userId: uid,
          title: `Studied for ${Math.floor(
            seconds / 60
          )} minutes`,
          createdAt: new Date(),
        }
      );

      Alert.alert(
        "Success",
        "Study Session Saved"
      );

      setRunning(false);
      setSeconds(0);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Failed to save session"
      );
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(0);
  };

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(
      (seconds % 3600) / 60
    );
    const secs = seconds % 60;

    return `${hrs
      .toString()
      .padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⏱ Study Timer
      </Text>

      <Text style={styles.timer}>
        {formatTime()}
      </Text>

      {!running ? (
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() =>
            setRunning(true)
          }
        >
          <Text style={styles.btnText}>
            ▶ Start
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.stopBtn}
          onPress={() =>
            setRunning(false)
          }
        >
          <Text style={styles.btnText}>
            ⏹ Stop
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.resetBtn}
        onPress={resetTimer}
      >
        <Text style={styles.btnText}>
          🔄 Reset
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveSession}
      >
        <Text style={styles.btnText}>
          💾 Save Session
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  timer: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 40,
  },

  startBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 12,
    width: 220,
    marginBottom: 15,
  },

  stopBtn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 12,
    width: 220,
    marginBottom: 15,
  },

  resetBtn: {
    backgroundColor: "#F59E0B",
    padding: 15,
    borderRadius: 12,
    width: 220,
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    width: 220,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});