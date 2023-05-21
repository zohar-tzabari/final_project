import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const IP = "172.20.29.94:8000";

export default function Try() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [ws, setWs] = useState(null);
  const itemToSearch = "bottle";


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    function setWsConnection() {
      console.log(itemToSearch);
      const newWs = new WebSocket(`ws://${IP}/stream/${itemToSearch}`);
      setWs(newWs);
    }
    setWsConnection();
  }, []);


  const takePicture = async () => {
    try {
      if (cameraRef) {
        const picture = await cameraRef.takePictureAsync({ base64: true });
        // Resize the photo
        let resizedPhoto = await ImageManipulator.manipulateAsync(
          picture.uri,
          [{ resize: { width: 320, height: 400 } }],
          {
            compress: 0.3,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );
        ws.send(JSON.stringify({ type: "image", data: resizedPhoto.base64 }));
        console.log("ok"); // Handle the taken photo as per your requirement
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
        ></View>
      </Camera>
      <StatusBar style="auto" />
    </View>
  );
}
