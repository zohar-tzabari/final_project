import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function HomePage() {
  const navigation = useNavigation();
  const handleButtonPress = (buttonText) => {
    console.log(`Pressed ${buttonText} button`);
    navigation.navigate('CameraPage');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My App</Text>
      <View style={styles.buttonColumn}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buttonTopLeft]} onPress={() => handleButtonPress('Button 1')}>
            <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonTopRight]} onPress={() => handleButtonPress('Button 2')}>
          <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 2</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buttonMiddleLeft]} onPress={() => handleButtonPress('Button 3')}>
          <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonMiddleRight]} onPress={() => handleButtonPress('Button 4')}>
          <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 4</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buttonBottomLeft]} onPress={() => handleButtonPress('Button 5')}>
          <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonBottomRight]} onPress={() => handleButtonPress('Button 6')}>
          <Image source={require('./assets/key.jpg')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Button 6</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CameraPage() {
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
    <View style={styles.cameraContainer}>
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="CameraPage" component={CameraPage} options={{ title: 'CameraPage' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
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
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    buttonColumn: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    button: {
      backgroundColor: '#3f51b5',
      borderRadius: 8,
      padding: 5,
      margin: 0,
      flex: 1,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonImage: {
      height: 100,
      width: 100,
      marginBottom: 10,
    },
    buttonTopLeft: {
      borderTopLeftRadius: 0,
    },
    buttonTopRight: {
      borderTopRightRadius: 0,
    },
    buttonMiddleLeft: {
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
    },
    buttonMiddleRight: {
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
    },
    buttonBottomLeft: {
      borderBottomLeftRadius: 0,
    },
    buttonBottomRight: {
      borderBottomRightRadius: 0,
    },
  });
