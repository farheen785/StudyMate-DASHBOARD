import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } =
    await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    alert("Notification permission not granted!");
    return false;
  }

  return true;
}

export async function scheduleReminder(
  taskTitle: string,
  seconds: number
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📚 StudyMateX Reminder",
      body: `${taskTitle} is still pending!`,
      sound: true,
    },
    trigger: {
      type:
        Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}