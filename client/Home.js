import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Platform, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Sound from 'react-native-sound';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental?.(true);

const Home = () => {
  const navigation = useNavigation();

  const handleButtonPress = (buttonName) => {
    navigation.navigate('Commera', { buttonName });
  };

  const handleButtonHover = () => {
    const isAndroid = NativeModules?.PlatformConstants?.os === 'android';
    if (isAndroid && NativeModules?.UIManager) {
      NativeModules.UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    // const hoverSound = new Sound('C:/Users/roe19/final_project/client/assets/sounds/key.mp3', Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.log('failed to load the sound', error);
    //     return;
    //   }
    //   hoverSound.play();
    // });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 1')}
        onPressIn={() => handleButtonHover()}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint="Key"
        accessibilityLabel="Key"
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/key.jpg')}
        />
        <Text style={styles.buttonText}>Button 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 2')}
        onPressIn={() => handleButtonHover()}
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/key.jpg')}
        />
        <Text style={styles.buttonText}>Button 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#008080',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
