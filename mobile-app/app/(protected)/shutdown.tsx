import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAuth } from "@/utils/authContext";

export default function ShutdownScreen() {
  const { token, apiUrl } = useAuth();

  const post_shutdown = async () => {
    try {
      const response = await fetch(
        `http://192.168.2.30:3000/shutdown?newURL=${encodeURIComponent(apiUrl ?? "")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    //   const response = await fetch(
    //     `${apiUrl}/shutdown?newURL=${encodeURIComponent(apiUrl ?? "")}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
      if (!response.ok) {
        throw new Error("Invalid token or API not reachable.");
      }
    } catch (error) {
      console.error("Error at API request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Warning! This Button Shutdowns your connected machine"
        onPress={post_shutdown}
        color="#ff4444"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
});
