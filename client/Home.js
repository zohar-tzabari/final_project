import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Platform, NativeModules,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Sound from 'react-native-sound';
import { Audio } from 'expo-av';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental?.(true);

const Home = () => {
  const navigation = useNavigation();

  const handleButtonPress = (buttonName) => {
    navigation.navigate('Commera', { buttonName });
  };

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./assets/sounds/key.mp3'));
    
  
    console.log('Playing Sound');
    await sound.playAsync();
  }

  const handleButtonHover = () => {
    

    playSound();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('key')}
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
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 2')}
        onPressIn={() => handleButtonHover()}
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/phone.jpg')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 3')}
        onPressIn={() => handleButtonHover()}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint="Key"
        accessibilityLabel="Key"
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/laptop.jpg')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 4')}
        onPressIn={() => handleButtonHover()}
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/umbrella.jpg')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 5')}
        onPressIn={() => handleButtonHover()}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint="Key"
        accessibilityLabel="Key"
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/remote.jpg')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonPress('Button 6')}
        onPressIn={() => handleButtonHover()}
      >
        <Image
          style={styles.buttonImage}
          source={require('./assets/bag.jpg')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    padding: 20,
    borderRadius: 0,
    //marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  buttonImage: {
    width: 67,
    height: 75,
    //marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
