import { useAuth } from "@/utils/authContext";
import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";

export default function HomeScreen() {
  const { logOut, token, apiUrl } = useAuth();
  const [status, setStatus] = useState<null | {
    cpu: number;
    ram: number;
    disk: number;
    uptime: number;
    os: string;
    hostname: string;
    ip_address: string;
  }>(null);

  const get_status = async () => {
    try {
      const response = await fetch(
        `http://192.168.2.30:3000/status?newURL=${encodeURIComponent(
          apiUrl ?? ""
        )}`,
    //   const response = await fetch(
    //     `${apiUrl}/status?newURL=${encodeURIComponent(
    //       apiUrl ?? ""
    //     )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invalid token or API not reachable.");
      }

      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error at API request:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>API Endpoint</Text>
        <Text style={styles.infoText}>{apiUrl || ""}</Text>

        <Text style={styles.infoTitle}>JWT Token</Text>
        <Text style={styles.infoText}>{token?.slice(0, 10)}...</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Show machine resources" onPress={get_status} />
        <Button title="Logout" onPress={logOut} />
      </View>

      {status && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>💻 Machine Resources</Text>
          <Text style={styles.statusItem}>Hostname: {status.hostname}</Text>
          <Text style={styles.statusItem}>OS: {status.os}</Text>
          <Text style={styles.statusItem}>CPU Usage: {status.cpu}%</Text>
          <Text style={styles.statusItem}>RAM Usage: {status.ram}%</Text>
          <Text style={styles.statusItem}>Disk Usage: {status.disk}%</Text>
          <Text style={styles.statusItem}>
            Uptime: {formatUptime(status.uptime)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function formatUptime(uptime: number) {
  const seconds = Math.floor(uptime % 60);
  const minutes = Math.floor((uptime / 60) % 60);
  const hours = Math.floor((uptime / 3600) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  statusContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#111827",
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
  },
});
