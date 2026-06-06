import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../src/services/firebase";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", uid)
      );

      const snapshot = await getDocs(q);

      const taskList: any[] = [];

      snapshot.forEach((document) => {
        taskList.push({
          id: document.id,
          ...document.data(),
        });
      });

      setTasks(taskList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    try {
      if (!title.trim()) {
        Alert.alert("Error", "Enter task title");
        return;
      }

      const uid = auth.currentUser?.uid;

      await addDoc(collection(db, "tasks"), {
        userId: uid,
        title,
        status: "Pending",
        createdAt: new Date(),
      });

      setTitle("");
      setModalVisible(false);

      Alert.alert("Success", "Task Added");

      loadTasks();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const markAsDone = async (taskId: string) => {
    try {
      await updateDoc(
        doc(db, "tasks", taskId),
        {
          status: "Completed",
        }
      );

      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(
        doc(db, "tasks", taskId)
      );

      loadTasks();
    } catch (error) {
      console.log(error);
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
    <View style={{ flex: 1 }}>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTasks}
          />
        }
        ListHeaderComponent={
          <Text style={styles.header}>
            📋 My Tasks
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.taskTitle}>
              {item.title}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color:
                    item.status === "Completed"
                      ? "green"
                      : "orange",
                },
              ]}
            >
              {item.status}
            </Text>

            <View style={styles.buttonRow}>

              {item.status !==
                "Completed" && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() =>
                    markAsDone(item.id)
                  }
                >
                  <Text style={styles.actionText}>
                    ✅ Done
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  deleteTask(item.id)
                }
              >
                <Text style={styles.actionText}>
                  🗑 Delete
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

      {/* Floating Add Button */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          setModalVisible(true)
        }
      >
        <Text style={styles.plus}>
          +
        </Text>
      </TouchableOpacity>

      {/* Add Task Modal */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Add New Task
            </Text>

            <TextInput
              placeholder="Task Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={addTask}
            >
              <Text style={styles.saveText}>
                Save Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text style={styles.cancel}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  status: {
    marginTop: 5,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  doneButton: {
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 10,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "red",
  },
});