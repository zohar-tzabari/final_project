import React, { useEffect } from "react";
import HomePresenter from "./HomePresenter";
import { Audio, Vibration } from "expo-av";
import * as Haptics from 'expo-haptics';


const HomeContainer = ({ navigation }) => {

  useEffect(() => {
    // Clean up any resources when the component unmounts
    return () => {
      Audio.Sound.unloadAsync();
    };
  }, []);

  const playSound = async (soundName) => {
    try {
      const soundMap = {
        key: require('./assets/sounds/key.mp3'),
        fork: require('./assets/sounds/fork.mp3'),
        spoon: require('./assets/sounds/spoon.mp3'),
        coin: require('./assets/sounds/coin.mp3'),
        bottle: require('./assets/sounds/bottle.mp3'),
        toothbrush: require('./assets/sounds/toothbrush.mp3'),
      };

      const sound = new Audio.Sound();
      await sound.loadAsync(soundMap[soundName]);
      await sound.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const handleButtonPress = (buttonName) => {
    console.log(buttonName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          navigation.navigate("SearchObject", { item: buttonName });
  };  

  const handleButtonHover = (soundName) => {
    playSound(soundName);
  };

  return (
    <HomePresenter
      handleButtonPress={handleButtonPress}
      handleButtonHover={handleButtonHover}
    />
  );
};

export default HomeContainer;
