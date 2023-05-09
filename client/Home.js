import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Platform, NativeModules, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental?.(true);

const Home = () => {
  
  const navigation = useNavigation();
  
  async function playSound(soundName) {
    switch (soundName){
      case "key":
        so = await Audio.Sound.createAsync( require('./assets/sounds/key.mp3'));
        break;
      case "fork":
        so = await Audio.Sound.createAsync( require('./assets/sounds/fork.mp3'));
        break;
      case "spoon":
        so = await Audio.Sound.createAsync( require('./assets/sounds/spoon.mp3'));
        break;
      case "knife":
        so = await Audio.Sound.createAsync( require('./assets/sounds/knife.mp3'));
        break;
        case "bottle":
        so = await Audio.Sound.createAsync( require('./assets/sounds/bottle.mp3'));
        break;
      case "toothbrush":
        so = await Audio.Sound.createAsync( require('./assets/sounds/toothbrush.mp3'));
        break;
    }
    
      const { sound } = so;
      await sound.playAsync();
  }
    
  const handleButtonPress = (buttonName) => {
    navigation.navigate('Commera', { buttonName });
  };

  const handleButtonHover = (soundName) => {
    playSound(soundName);
  };

  return (
    <View style={styles.container}>

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('key')}
          onPressIn={() => handleButtonHover('key')}
        >
          <Image
            style={styles.buttonImage}
            source={require('./assets/key.jpg')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('fork')}
          onPressIn={() => handleButtonHover('fork')}
          >
          <Image
            style={styles.buttonImageFork}
            source={require('./assets/fork.jpg')}
          />
        </TouchableOpacity>

      </View>

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('spoon')}
          onPressIn={() => handleButtonHover('spoon')}
          >
          <Image
            style={styles.buttonImageSpoon}
            source={require('./assets/spoon.jpg')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('knife')}
          onPressIn={() => handleButtonHover('knife')}
          >
          <Image
            style={styles.buttonImageSpoon}
            source={require('./assets/knife.jpg')}
          />
        </TouchableOpacity>

      </View>

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('bottle')}
          onPressIn={() => handleButtonHover('bottle')}
          >
          <Image
            style={styles.buttonImage}
            source={require('./assets/bottle.jpg')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('toothbrush')}
          onPressIn={() => handleButtonHover('toothbrush')}
          >
          <Image
            style={styles.buttonImageToot}
            source={require('./assets/toothbrush.jpg')}
          />
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    //padding: 20,
    //borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    alignItems: 'center',
    //borderWidth: 1,
    //borderColor: 'black'
  },
  buttonImage: {
    width: '80%',
    height: '80%',
  },
  buttonImageSpoon: {
    width: '100%',
    height: '60%',
  },
  buttonImageFork: {
    width: '100%',
    height: '80%',
  },
  buttonImageToot: {
    width: '100%',
    height: '20%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;  