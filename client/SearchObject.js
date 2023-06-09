import * as ImageManipulator from "expo-image-manipulator";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Camera } from "expo-camera";


const IP = "10.100.102.20:8000";

export default function SearchObject() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [ws, setWs] = useState(null);
  const route = useRoute();
  const itemToSearch = route.params.item;

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
  }, [itemToSearch]);

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
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (ws) {
      setInterval(takePicture, 10);
      ws.onmessage = (event) => {
        const foundItem = JSON.parse(JSON.parse(event.data).isItemFound);
        if (foundItem) {
          // console.log("found");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        //setImageData(current_photo);
      };
    }
  }, [ws,itemToSearch]);

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
