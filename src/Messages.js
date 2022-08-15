import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Messages({ message }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        margin: 10,
        borderColor: "#03dfff",
        borderWidth: 1,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 30,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <AntDesign
          name="infocirlceo"
          size={15}
          color="#03dfff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.text}>Safety Tips</Text>
      </View>

      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

export default Messages;

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: "300",
    color: "grey",
  },
});
