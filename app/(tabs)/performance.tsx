
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth, db } from "../../src/services/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function PerformanceScreen() {
  const [loading, setLoading] = useState(true);

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", uid)
      );

      const snapshot = await getDocs(q);

      const tasks: any[] = [];

      snapshot.forEach((doc) => {
        tasks.push(doc.data());
      });

      const total = tasks.length;

      const completed = tasks.filter(
        (task) => task.status === "Completed"
      ).length;

      const pending = total - completed;

      const rate =
        total > 0
          ? Math.round((completed / total) * 100)
          : 0;

      setTotalTasks(total);
      setCompletedTasks(completed);
      setPendingTasks(pending);
      setCompletionRate(rate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        📊 Performance Dashboard
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          📋 Total Tasks
        </Text>
        <Text style={styles.value}>
          {totalTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          ✅ Completed Tasks
        </Text>
        <Text style={styles.value}>
          {completedTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          ⌛ Pending Tasks
        </Text>
        <Text style={styles.value}>
          {pendingTasks}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          📈 Completion Rate
        </Text>
        <Text style={styles.value}>
          {completionRate}%
        </Text>
      </View>

      <View style={styles.bigCard}>
        <Text style={styles.bigTitle}>
          🎯 Study Progress
        </Text>

        <Text style={styles.bigPercent}>
          {completionRate}%
        </Text>

        <Text style={styles.progressText}>
          Keep completing tasks to improve
          your performance!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    color: "#666",
  },

  value: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
    color: "#4F46E5",
  },

  bigCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 25,
    marginTop: 10,
    marginBottom: 30,
  },

  bigTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  bigPercent: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 15,
  },

  progressText: {
    color: "#fff",
    fontSize: 16,
  },
});