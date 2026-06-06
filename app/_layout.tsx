import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="signup"
        options={{ title: "Signup" }}
      />
      <Stack.Screen
  name="forgot"
  options={{ title: "Forgot Password" }}
/>
      <Stack.Screen
        name="home"
        options={{ title: "Home" }}
      />
    </Stack>
  );
}