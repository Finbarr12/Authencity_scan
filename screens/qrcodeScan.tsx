import React, { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<any>(null);

  // Handle permission loading or request
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Handle the barcode scanned result
  const handleBarcodeScanned = ({ data, type, bounds, cornerPoints }: any) => {
    console.log("Scanned Data:", data);
    console.log("Barcode Type:", type);
    console.log("Bounding Box:", bounds);
    console.log("Corner Points:", cornerPoints);

    // Store the scanned data and display it
    setScanned(true);
    setBarcodeData({ data, type, bounds, cornerPoints });

    Alert.alert("QR Code Scanned", `Data: ${data}`, [
      { text: "Scan Again", onPress: () => setScanned(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // We are only scanning QR codes
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // Only scan once
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {scanned && barcodeData && (
        <View style={styles.resultContainer}>
          <Text style={styles.text}>Scanned Data: {barcodeData.data}</Text>
          <Text style={styles.text}>Barcode Type: {barcodeData.type}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  resultContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
});
