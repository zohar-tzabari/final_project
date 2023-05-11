import React, { useEffect } from "react";
import HomePresenter from "./HomePresenter";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";


const HomeContainer = () => {
  const navigation = useNavigation();

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
        knife: require('./assets/sounds/knife.mp3'),
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
    navigation.navigate("SearchObject", { buttonName });
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
