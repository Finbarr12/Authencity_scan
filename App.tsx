import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

import Logs from "./screens/Logs";
import QRScanner from "./screens/QRScanner";
import UserSettings from "./screens/userSettings";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            if (route.name === "Logs") {
              iconName = "document-text-outline";
            } else if (route.name === "Scan Product") {
              iconName = "qr-code-outline";
            } else if (route.name === "Settings") {
              iconName = "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#957AC9",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarLabelStyle: { fontSize: 14, fontFamily: "Georgia" },
        })}
      >
        <Tab.Screen
          name="Logs"
          component={Logs}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Scan Product"
          component={QRScanner}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={UserSettings}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default App;
