import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";


export default function Try() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const picture = await cameraRef.takePictureAsync();
        console.log(picture); // Handle the taken photo as per your requirement
      }
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    setInterval(takePicture, 400);
  }, [hasPermission]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={(ref) => setCameraRef(ref)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
        </View>
      </Camera>
      <StatusBar style="auto" />
    </View>
  );
}

