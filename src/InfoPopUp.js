import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, Text, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  color,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import HyperLink from "react-native-hyperlink";

const { height: DEVICE_HEIGHT } = Dimensions.get("window");

const InfoPopUp = React.forwardRef(({ secInfo, url, setText }, ref) => {
  console.log(secInfo);
  const context = useSharedValue({ y: 0 });
  const translateY = useSharedValue(0);
  const MAX_TRANSLATEY = -DEVICE_HEIGHT + 50;

  const scrollTo = useCallback((destination) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  function close() {
    scrollTo(0);
    setText("Scan QR Code");
  }

  ref.current = {
    scrollTo: scrollTo,
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATEY);
      //   console.log(event.translationY);
    })
    .onEnd(() => {
      if (translateY.value > -DEVICE_HEIGHT / 3) {
        scrollTo(0);
      } else if (translateY.value < -DEVICE_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATEY);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <>
      {!secInfo ? (
        <View></View>
      ) : (
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.BottomSheetContainer, rBottomSheetStyle]}
          >
            <View style={styles.line} />
            <View style={styles.trustScorDiv}>
              <Text style={styles.trustLabel}>Trust Score</Text>
              <Text
                style={{
                  color:
                    secInfo.data.report.trust_score.result >= 80
                      ? "#00ff27"
                      : "red",
                  fontSize: 70,
                  fontWeight: "500",
                  margin: 15,
                }}
              >
                {secInfo.data.report.trust_score.result}
              </Text>
            </View>
            <Text style={styles.heading}>Security Check</Text>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>URL</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.url_parts.host}
              </Text>
            </View>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>Detections</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.domain_blacklist.detections}
              </Text>
            </View>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>Redirections</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.redirection.found}
              </Text>
            </View>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>IP</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.server_details.ip}
              </Text>
            </View>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>Country</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.server_details.country_name}
              </Text>
            </View>
            <Text style={styles.heading}>Webpage Info</Text>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>Title</Text>
              <Text style={styles.checkText}>
                {secInfo.data.report.web_page.title}
              </Text>
            </View>
            <View style={styles.checkDiv}>
              <Text style={styles.checkLabel}>Description</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.checkDesc}
              >
                {secInfo.data.report.web_page.description}
              </Text>
            </View>
            <View style={styles.buttonDiv}>
              <Pressable style={styles.buttonClose} onPress={() => close()}>
                <Text style={styles.text}>Close</Text>
              </Pressable>
              <Pressable style={styles.buttonContinue}>
                <HyperLink
                  linkDefault={true}
                  linkText={(urll) => (url ? "Continue" : urll)}
                >
                  <Text style={styles.text}>{url}</Text>
                </HyperLink>
              </Pressable>
            </View>
            <Text style={styles.link}>More Security Information</Text>
          </Animated.View>
        </GestureDetector>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  BottomSheetContainer: {
    height: DEVICE_HEIGHT,
    width: "100%",
    backgroundColor: "#f3f3f3",
    borderColor: "grey",
    position: "absolute",
    top: DEVICE_HEIGHT,
    borderRadius: 25,
    shadowColor: "black",
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 0.36,
    shadowRadius: 20,
    paddingHorizontal: 10,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  trustScorDiv: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trustLabel: {
    color: "#182E44",
    fontSize: 20,
    fontWeight: "500",
    margin: 15,
    // borderColor: "black",
    // borderWidth: 1,
    top: 40,
  },
  heading: {
    color: "#03dfff",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
    margin: 5,
  },
  checkLabel: {
    color: "gray",
    fontSize: 15,
    fontWeight: "500",
    margin: 15,
  },
  checkText: {
    color: "black",
    fontSize: 18,
    fontWeight: "500",
    margin: 15,
  },
  checkDesc: {
    color: "black",
    fontSize: 18,
    fontWeight: "500",
    margin: 15,
    flex: 1,
  },
  checkDiv: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
  },
  buttonDiv: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonClose: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "red",
  },
  buttonContinue: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "#00ff27",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  link: {
    marginTop: 25,
    fontSize: 15,
    textDecorationLine: "underline",
    textDecorationColor: "#03dfff",
    color: "#03dfff",
  },
});

export default InfoPopUp;
