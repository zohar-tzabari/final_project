import React from "react";
import {View, TouchableOpacity, StyleSheet, Image} from "react-native";

const ButtonFactory = ({ onPress, onPressIn, buttonImageStyle, source }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} onPressIn={onPressIn}>
      <Image style={buttonImageStyle} source={source} />
    </TouchableOpacity>
  );
};

const HomePresenter = ({ handleButtonPress, handleButtonHover }) => {
  const createButton = (buttonName, imageSource) => {
    return (
      <ButtonFactory
        onPress={() => handleButtonPress(buttonName)}
        onPressIn={() => handleButtonHover(buttonName)}
        buttonImageStyle={styles.buttonImage}
        source={imageSource}
      />
    );
  };
  
  return (
<View style={styles.container}>
      <View style={styles.row}>
        {createButton("key", require("./assets/key.png"))}
        {createButton("coin", require("./assets/coin.png"))}
      </View>

      <View style={styles.row}>
        {createButton("spoon", require("./assets/spoon.png"))}
        {createButton("fork", require("./assets/fork.png"))}
      </View>

      <View style={styles.row}>
        {createButton("bottle", require("./assets/bottle.png"))}
        {createButton("toothbrush", require("./assets/toothbrush.png"))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    //padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: "100%",
    alignItems: "center",
    borderWidth: 1,
    //borderColor: 'black'
  },
  buttonImage: {
    width: "100%",
    height: "80%",
  },
});
export default HomePresenter;
