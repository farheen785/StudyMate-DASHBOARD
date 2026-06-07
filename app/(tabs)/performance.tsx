import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../src/services/firebase";

export default function PerformanceScreen() {
  const [loading, setLoading] = useState(true);

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  const [studySeconds, setStudySeconds] = useState(0);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;

      if (!uid) return;

      // TASKS
      const taskQuery = query(
        collection(db, "tasks"),
        where("userId", "==", uid)
      );

      const taskSnapshot = await getDocs(taskQuery);

      let total = 0;
      let completed = 0;
      let pending = 0;

      taskSnapshot.forEach((document) => {
        total++;

        const task = document.data();

        if (task.status === "Completed") {
          completed++;
        } else {
          pending++;
        }
      });

      setTotalTasks(total);
      setCompletedTasks(completed);
      setPendingTasks(pending);

      // STUDY SESSIONS
      const sessionQuery = query(
        collection(db, "study_sessions"),
        where("userId", "==", uid)
      );

      const sessionSnapshot = await getDocs(
        sessionQuery
      );

      let totalStudySeconds = 0;

      sessionSnapshot.forEach((document) => {
        const session = document.data();

        totalStudySeconds +=
          session.duration || 0;
      });

      setStudySeconds(totalStudySeconds);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadPerformance}
        />
      }
    >
      <Text style={styles.header}>
        📊 Performance
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>
          📋 Total Tasks
        </Text>

        <Text style={styles.number}>
          {totalTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          ✅ Completed Tasks
        </Text>

        <Text style={styles.number}>
          {completedTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          ⏳ Pending Tasks
        </Text>

        <Text style={styles.number}>
          {pendingTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          📚 Total Study Time
        </Text>

        <Text style={styles.number}>
          {Math.floor(
            studySeconds / 3600
          )}h{" "}
          {Math.floor(
            (studySeconds % 3600) / 60
          )}m
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          🎯 Completion Rate
        </Text>

        <Text style={styles.number}>
          {completionRate}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          🔥 Study Status
        </Text>

        <Text style={styles.status}>
          {studySeconds >= 3600
            ? "Excellent"
            : studySeconds >= 1800
            ? "Good"
            : "Needs Improvement"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    color: "#4F46E5",
    fontWeight: "bold",
    marginBottom: 10,
  },

  number: {
    fontSize: 30,
    fontWeight: "bold",
  },

  status: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#22C55E",
  },
});