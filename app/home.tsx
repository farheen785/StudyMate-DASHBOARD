import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function HomeScreen() {
  const { name } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>

        <View style={styles.userInfo}>

          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>
              {name ? `${name}!` : "Student!"}
            </Text>
          </View>
        </View>

        <View style={styles.icons}>
          <Text style={styles.icon}>🗺️</Text>
          <Text style={styles.icon}>🔔</Text>
        </View>
      </View>

      {/* Goal Card */}
      <View style={styles.goalCard}>
        <View>
          <Text style={styles.goalText}>Current Goal:</Text>
          <Text style={styles.goalTitle}>4hrs Focus</Text>
        </View>

        <View style={styles.circle}>
          <Text style={styles.percent}>75%</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>⏰</Text>
          <Text style={styles.cardText}>Focus Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📚</Text>
          <Text style={styles.cardText}>Resources</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardText}>Study Groups</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.activityCard}>
        <Text>📄 Data Structures Note Added</Text>
        <Text style={styles.time}>2h ago</Text>
      </View>

      <View style={styles.activityCard}>
        <Text>📄 Algorithms Chapter 3 Revised</Text>
        <Text style={styles.time}>4h ago</Text>
      </View>

      <View style={styles.activityCard}>
        <Text>📄 Interview Questions Downloaded</Text>
        <Text style={styles.time}>6h ago</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },

  menu: {
    fontSize: 26,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    fontSize: 45,
    marginRight: 10,
  },

  hello: {
    fontSize: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
  },

  icons: {
    flexDirection: "row",
  },

  icon: {
    fontSize: 24,
    marginLeft: 12,
  },

  goalCard: {
    backgroundColor: "#5A49B6",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  goalText: {
    color: "white",
    fontSize: 18,
  },

  goalTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  percent: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },

  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },

  activityCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
  },

  time: {
    color: "gray",
    marginTop: 5,
  },
});