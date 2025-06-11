import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/utils/authContext";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1f2937",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#f3f4f6",
            borderTopWidth: 0,
            elevation: 8,
          },
          headerStyle: {
            backgroundColor: "#f3f4f6",
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },
          headerTintColor: "#1f2937",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Status",
            tabBarLabel: "Status",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="shutdown"
          options={{
            title: "Shutdown",
            tabBarLabel: "Shutdown",
            tabBarIcon: ({ color, size }) => (
              <Feather name="power" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
