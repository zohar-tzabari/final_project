import { Camera, CameraType } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { MediaRecorder, Video, AVPlaybackStatus } from "expo-av";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [streamUrl, setStreamUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  // const [cameraRef, setCameraRef] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const startStreaming = async () => {
    try {
      if (cameraRef.current) {
        console.log("zohar");
        const streamUrlLocal = "http://10.100.102.20:8000/stream";
        setStreamUrl(streamUrl);
        const stream = await cameraRef.current.takePictureAsync(); // get the camera stream
        let form = new FormData();
        form.append("file", {
          uri: stream.uri,
          type: "image/jpeg",
          name: "image.jpg",
        });
        let req = await axios({
          method: "post",
          url: streamUrlLocal,
          data: form,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
        let res = await req.data;
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  setInterval(startStreaming, 500); // Call startStreaming every 0.1 second (100 milliseconds)

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
