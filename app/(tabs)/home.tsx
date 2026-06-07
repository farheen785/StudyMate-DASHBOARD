import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import { auth, db } from "../../src/services/firebase";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const [studySeconds, setStudySeconds] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  const [goalProgress, setGoalProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rank, setRank] = useState("Beginner");

  // =========================
  // AUTO REFRESH ON FOCUS
  // =========================
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // RANK SYSTEM
  // =========================
  const calculateRank = (hours: number) => {
    if (hours >= 100) return "Master";
    if (hours >= 50) return "Expert";
    if (hours >= 20) return "Advanced";
    if (hours >= 5) return "Intermediate";
    return "Beginner";
  };

  // =========================
  // STREAK CALCULATION (basic logic)
  // =========================
  const calculateStreak = (sessions: any[]) => {
    if (!sessions.length) return 0;

    const dates = new Set(
      sessions.map((s) =>
        new Date(s.createdAt?.seconds * 1000)
          .toDateString()
      )
    );

    return dates.size;
  };

  // =========================
  // LOAD DASHBOARD
  // =========================
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;
      if (!uid) return;

      // USER DATA
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      // TASKS
      const taskSnapshot = await getDocs(
        query(collection(db, "tasks"), where("userId", "==", uid))
      );

      let completed = 0;
      let pending = 0;

      taskSnapshot.forEach((doc) => {
        const task = doc.data();
        task.status === "Completed" ? completed++ : pending++;
      });

      setCompletedTasks(completed);
      setPendingTasks(pending);

      // STUDY SESSIONS
      const sessionSnapshot = await getDocs(
        query(collection(db, "study_sessions"), where("userId", "==", uid))
      );

      let totalSeconds = 0;
      const sessionList: any[] = [];

      sessionSnapshot.forEach((doc) => {
        const session = doc.data();
        totalSeconds += session.duration || 0;

        sessionList.push(session);
      });

      setStudySeconds(totalSeconds);

      // STREAK
      setStreak(calculateStreak(sessionList));

      // RANK
      const hours = totalSeconds / 3600;
      setRank(calculateRank(hours));

      // GOAL PROGRESS (example goal = 50 hours)
      setGoalProgress(Math.min((hours / 50) * 100, 100));

      // ACTIVITIES
      const activitySnapshot = await getDocs(
        query(collection(db, "activities"), where("userId", "==", uid))
      );

      const activityList: any[] = [];

      activitySnapshot.forEach((doc) => {
        activityList.push({ id: doc.id, ...doc.data() });
      });

      activityList.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setActivities(activityList.slice(0, 5));
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
      }
    >
      <Text style={styles.header}>
        Hello, {userData?.name || "Student"} 👋
      </Text>

      <Text style={styles.subtitle}>
        Welcome back to StudyMateX
      </Text>

      {/* GOAL */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>🎯 Current Goal</Text>
        <Text style={styles.cardText}>
          {userData?.goal || "No Goal Set"}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${goalProgress}%` },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {goalProgress.toFixed(0)}% completed
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>📚 Study Hours</Text>
          <Text style={styles.number}>
            {Math.floor(studySeconds / 3600)}h{" "}
            {Math.floor((studySeconds % 3600) / 60)}m
          </Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>🔥 Streak</Text>
          <Text style={styles.number}>{streak} days</Text>
        </View>
      </View>

      {/* TASKS */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>📋 Task Summary</Text>

        <Text style={styles.taskText}>
          ✅ Completed: {completedTasks}
        </Text>

        <Text style={styles.taskText}>
          ⏳ Pending: {pendingTasks}
        </Text>
      </View>

      {/* RANK */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>🏆 Rank</Text>
        <Text style={styles.cardText}>{rank}</Text>
      </View>

      {/* ACTIVITIES */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>📈 Recent Activities</Text>

        {activities.length ? (
          activities.map((item) => (
            <Text key={item.id} style={styles.activity}>
              • {item.title}
            </Text>
          ))
        ) : (
          <Text>No activities yet</Text>
        )}
      </View>

      {/* NAV BUTTONS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/tasks")}
      >
        <Text style={styles.buttonText}>View Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/performance")}
      >
        <Text style={styles.buttonText}>Performance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/timer")}
      >
        <Text style={styles.buttonText}>Study Timer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// =========================
// STYLES
// =========================
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
    marginTop: 20,
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bigCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  smallCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
  },
  number: {
    fontSize: 22,
    fontWeight: "bold",
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  activity: {
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  progressBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 10,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
});