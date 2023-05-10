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
        buttonImageStyle={buttonName === "toothbrush" ? styles.buttonImageToot : buttonName === "spoon" ? styles.buttonImageSpoon : buttonName === "knife" ? styles.buttonImageSpoon :  buttonName === "fork" ? styles.buttonImageFork : styles.buttonImage}
        source={imageSource}
      />
    );
  };
  
  return (
<View style={styles.container}>
      <View style={styles.row}>
        {createButton("key", require("./assets/key.jpg"))}
        {createButton("fork", require("./assets/fork.jpg"))}
      </View>

      <View style={styles.row}>
        {createButton("spoon", require("./assets/spoon.jpg"))}
        {createButton("knife", require("./assets/knife.jpg"))}
      </View>

      <View style={styles.row}>
        {createButton("bottle", require("./assets/bottle.jpg"))}
        {createButton("toothbrush", require("./assets/toothbrush.jpg"))}
      </View>
    </View>
  );
  
    // <View style={styles.container}>
    //   <View style={styles.row}>
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("key")}
    //       onPressIn={() => handleButtonHover("key")}
    //     >
    //       <Image
    //         style={styles.buttonImage}
    //         source={require("./assets/key.jpg")}
    //       />
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("fork")}
    //       onPressIn={() => handleButtonHover("fork")}
    //     >
    //       <Image
    //         style={styles.buttonImageFork}
    //         source={require("./assets/fork.jpg")}
    //       />
    //     </TouchableOpacity>
    //   </View>

    //   <View style={styles.row}>
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("spoon")}
    //       onPressIn={() => handleButtonHover("spoon")}
    //     >
    //       <Image
    //         style={styles.buttonImageSpoon}
    //         source={require("./assets/spoon.jpg")}
    //       />
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("knife")}
    //       onPressIn={() => handleButtonHover("knife")}
    //     >
    //       <Image
    //         style={styles.buttonImageSpoon}
    //         source={require("./assets/knife.jpg")}
    //       />
    //     </TouchableOpacity>
    //   </View>

    //   <View style={styles.row}>
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("bottle")}
    //       onPressIn={() => handleButtonHover("bottle")}
    //     >
    //       <Image
    //         style={styles.buttonImage}
    //         source={require("./assets/bottle.jpg")}
    //       />
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => handleButtonPress("toothbrush")}
    //       onPressIn={() => handleButtonHover("toothbrush")}
    //     >
    //       <Image
    //         style={styles.buttonImageToot}
    //         source={require("./assets/toothbrush.jpg")}
    //       />
    //     </TouchableOpacity>
    //   </View>
    // </View>
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
    backgroundColor: "#ffffffff",
    //padding: 20,
    //borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: "100%",
    alignItems: "center",
    //borderWidth: 1,
    //borderColor: 'black'
  },
  buttonImage: {
    width: "80%",
    height: "80%",
  },
  buttonImageSpoon: {
    width: "100%",
    height: "60%",
  },
  buttonImageFork: {
    width: "100%",
    height: "80%",
  },
  buttonImageToot: {
    width: "100%",
    height: "20%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
export default HomePresenter;
