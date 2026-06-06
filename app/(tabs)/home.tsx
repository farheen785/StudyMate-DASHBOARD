import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;

      if (!uid) return;

      // User Data
      const userDoc = await getDoc(
        doc(db, "users", uid)
      );

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      // Activities
      const activityQuery = query(
        collection(db, "activities"),
        where("userId", "==", uid)
      );

      const activitySnapshot =
        await getDocs(activityQuery);

      const activityList: any[] = [];

      activitySnapshot.forEach((doc) => {
        activityList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setActivities(activityList);
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadDashboard}
        />
      }
    >
      <Text style={styles.header}>
        Hello, {userData?.name || "Student"} 👋
      </Text>

      <Text style={styles.subtitle}>
        Welcome back to StudyMateX
      </Text>

      {/* Goal */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>
          🎯 Current Goal
        </Text>
        <Text style={styles.cardText}>
          {userData?.goal || "No Goal Set"}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>
            📚 Study Hours
          </Text>
          <Text style={styles.number}>
            {userData?.studyHours || 0}
          </Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>
            🔥 Streak
          </Text>
          <Text style={styles.number}>
            {userData?.streak || 0}
          </Text>
        </View>
      </View>

      {/* Rank */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>
          🏆 Rank
        </Text>
        <Text style={styles.cardText}>
          {userData?.rank || "Beginner"}
        </Text>
      </View>

      {/* Activities */}
      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>
          📈 Recent Activities
        </Text>

        {activities.length > 0 ? (
          activities.map((item) => (
            <Text
              key={item.id}
              style={styles.activity}
            >
              • {item.title}
            </Text>
          ))
        ) : (
          <Text>No activities yet</Text>
        )}
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/tasks")}
      >
        <Text style={styles.buttonText}>
          View Tasks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push("/performance")
        }
      >
        <Text style={styles.buttonText}>
          View Performance
        </Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
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
});