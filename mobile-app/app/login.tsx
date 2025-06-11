import { useAuth } from "@/utils/authContext";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Button,
} from "react-native";

export default function LoginScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedUrl, setScannedUrl] = useState("");
  const [token, setToken] = useState("");
  const [scanningField, setScanningField] = useState<"url" | "token" | null>(null);

  const auth = useAuth();

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanningField === "url") {
      setScannedUrl(data);
    } else if (scanningField === "token") {
      setToken(data);
    }
    setScanningField(null);
  };

  const handleLogin = async () => {
    if (!scannedUrl || !token) {
      Alert.alert("Error", "Enter URL and JWT Token");
      return;
    }

    const isValid = await auth.validateLogin(token, scannedUrl);
    if (isValid) {
      auth.logIn(token, scannedUrl);
    } else {
      Alert.alert("Login Failed!", "Invalid Token or URL.");
    }
  };

  if (!permission) return null;

    if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Camera access is required</Text>
        <Button title="Allow camera access" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.heading}>Login via QR & Token</Text>

        {scanningField ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="API URL"
              placeholderTextColor="#999"
              value={scannedUrl}
              onChangeText={setScannedUrl}
            />
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setScanningField("url")}
            >
              <Text style={styles.buttonText}>Scan URL</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="JWT Token"
              placeholderTextColor="#999"
              value={token}
              onChangeText={setToken}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setScanningField("token")}
            >
              <Text style={styles.buttonText}>Scan Token</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  buttonSecondary: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  camera: {
    height: 320,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
});
