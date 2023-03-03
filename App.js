import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const fetchApi = async() =>
  {
    try{
    const res = await axios.get("http://127.0.0.1/itemsTwo");
    }catch(error)
    {
      console.log(error.message);
    }
  }


  useEffect(() => {
    fetchApi()
  }, []);


  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }



  function toggleCameraType() {
    setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startStreaming}>
          <Text style={styles.text}>Start Streaming</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

async function startStreaming() {
  try {
    const streamUrl = 'http://localhost:8000/items';
    const response = await axios.post(streamUrl, { message: 'hi' });
    console.log('Streaming started successfully:', response.data);
  } catch (error) {
    console.error('Failed to start streaming:', error);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
