import { Camera, CameraType } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { encode as btoa } from "base-64";
import * as ImageManipulator from "expo-image-manipulator";

export const Commera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [ws, setWs] = useState(null);
  // const [cameraRef, setCameraRef] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    function setWsConnection() {
      const newWs = new WebSocket("ws://192.168.197.186:8000/stream");
      setWs(newWs);
    }
    setWsConnection();
  }, []);

  const startStreaming = async () => {
    try {
      if (cameraRef.current && ws) {
        // Take picture with camera
        const picture = await cameraRef.current.takePictureAsync();

        // Resize image to YOLOv5 size (640x640)
        const resizedPicture = await ImageManipulator.manipulateAsync(
          picture.uri,
          [{ resize: { width: 640, height: 640 } }],
          { format: "jpeg" }
        );

        // Convert image to base64 format
        const response = await fetch(resizedPicture.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64data = reader.result.split(",")[1];
          ws.send(JSON.stringify({ type: "image", data: base64data }));
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ws) {
      setInterval(startStreaming, 500);
    }
  }, [ws]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        console.log(event.data);
      };
    }
  }, [ws]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function toggleCameraType() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} ref={cameraRef}></Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={console.log("press")}>
          <Text style={styles.text}>Start Streaming</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Commera;