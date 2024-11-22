import React, { useState, useRef, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<any>(null);
  const [scanAnimation, setScanAnimation] = useState(new Animated.Value(0)); // To animate the scanning line
  const [popupScale] = useState(new Animated.Value(0)); // To scale the popup QR code

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
  const handleBarcodeScanned = ({ data, type }: any) => {
    console.log("Scanned Data:", data);
    console.log("Barcode Type:", type);

    // Store the scanned data and display it
    setScanned(true);
    setBarcodeData({ data, type });

    // Start the popup animation
    Animated.timing(popupScale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Trigger the scan animation (simulating the scan process)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Alert.alert("QR Code Scanned", `Data: ${data}`, [
      { text: "Scan Again", onPress: () => setScanned(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="qrcode" size={24} color="black" style={styles.icon} />

      <Text style={styles.scanTxt}>Scan QR Code</Text>

      <View style={styles.CodeHolder}>
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
              {/* <Text style={styles.text}>Flip Camera</Text> */}
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* QR Code Popup Animation */}
      {scanned && barcodeData && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              transform: [{ scale: popupScale }], // Apply scaling to the result container
            },
          ]}
        >
          <Text style={styles.text}>Scanned Data: {barcodeData.data}</Text>
          <Text style={styles.text}>Barcode Type: {barcodeData.type}</Text>
        </Animated.View>
      )}

      {/* Scanning Animation */}
      <Animated.View
        style={[
          styles.scanLine,
          {
            opacity: scanAnimation, // Apply the animated scan line opacity
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scanTxt: {
    fontSize: 35,
    marginTop: 190,
    marginLeft: 30,
  },
  CodeHolder: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  icon: {
    position: "absolute",
    top: 100,
    left: 30,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: 250,
    height: 250,
    borderRadius: 25, // Curved corners
    overflow: "hidden", // This ensures the camera view respects the curved borders
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
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "red",
  },
});
