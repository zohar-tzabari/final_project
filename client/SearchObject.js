import { Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Vibration } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const cameraType = Camera.Constants.Type.back;

const IP = "10.100.102.20:8000";

export default function SearchObject() {
  const [hasPermission, setHasPermission] = useState(null);
  const [ws, setWs] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [itemFound, setItemFound] = useState(false);
  const route = useRoute();
  const itemToSearch = route.params.item;

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      // Set manual focus
      setHasPermission(status === "granted");
      console.log(windowWidth);
      console.log(windowHeight);
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

  const startStreaming = async () => {
    try {
      if (cameraRef.current && ws) {

        let photo = await cameraRef.current.takePictureAsync({ base64: true });

        // Resize the photo
        let resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 320, height: 400} }],
          {compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        ws.send(JSON.stringify({ type: "image", data: resizedPhoto.base64 }));
      }
      // }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (ws) {
      setInterval(startStreaming, 20);
      ws.onmessage = (event) => {
        const current_photo = JSON.parse(event.data).current_photo;
        const foundItem = JSON.parse(JSON.parse(event.data).isItemFound);
        setItemFound(foundItem);
        if (foundItem) {
          console.log(foundItem);
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setImageData(current_photo);
      };
    }
  }, [ws]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ display: "none" }}>
        <Camera type={cameraType} style={{ flex: 1 }} ref={cameraRef}></Camera>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageData}` }}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E7F7", // modified to black
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "contain",
    borderRadius: 10,
  },
});
