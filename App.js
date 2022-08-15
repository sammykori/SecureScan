import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import InfoPopUp from "./src/InfoPopUp";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Messages from "./src/Messages";
import { URL } from "react-native-url-polyfill";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Scan QR Code");
  const [securityInformation, setSecurityInformation] = useState();
  const [message, setMessage] = useState();
  const advice = [
    "Check for more information on the poster or flyer about the QR code",
    "Make Sure you know what website or URL you are looking to scan",
    "Remember to check the information before visiting the website",
  ];

  const askForPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  const getRandomMessages = () => {
    const number = Math.floor(Math.random() * 3);
    return advice[number];
  };

  const fetchSecurityInformation = (domain) => {
    console.log("This is host " + domain);
    setText(domain);
    axios
      .get("https://endpoint.apivoid.com/sitetrust/v1/pay-as-you-go", {
        params: {
          key: "534c29e8f1a32ad41aa3abf7619434650568dd09",
          host: domain,
        },
      })
      .then(function (response) {
        setSecurityInformation(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //useRef
  const ref = useRef(null);

  //useEffect
  useEffect(() => {
    askForPermission();
    const mess = getRandomMessages();
    setMessage(mess);
  }, []);

  //useCallback
  const showPopUpInfo = useCallback(() => {
    ref?.current?.scrollTo(-200);
  }, []);

  async function handleQRCodeScanned({ type, data }) {
    setScanned(true);
    let domain = new URL(data);
    domain = domain.hostname;
    fetchSecurityInformation(domain);
    showPopUpInfo();
  }

  //
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for Camera Permission</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No Access to camera</Text>
        <Button title={"Allow"} onPress={() => askForPermission()}></Button>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Messages message={message} />
        {/* <View> */}
        <Image
          source={require("./assets/s.png")}
          style={{ width: 50, height: 50 }}
        />
        <Text style={styles.topic}>SecureScan</Text>
        <Text style={styles.para}>
          verify the trustworthiness of the websites you scan
        </Text>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
          style={styles.barcodebox}
        />
        {/* </View> */}
        <View style={styles.checkDiv}>
          <Text style={styles.checkText}>{text}</Text>
        </View>
        {scanned && (
          <Button
            title={"Scan Again"}
            onPress={() => setScanned(false)}
            color="#11caf5"
          />
        )}
        <InfoPopUp
          ref={ref}
          secInfo={securityInformation}
          url={text}
          setText={setText}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  topic: {
    fontSize: 60,
    fontWeight: "100",
    color: "#03dfff",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 10,
  },
  para: {
    fontSize: 12,
    fontWeight: "500",
    color: "grey",
    textAlign: "center",
    marginBottom: 30,
    flexWrap: "wrap",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
  checkText: {
    color: "grey",
    fontSize: 18,
    fontWeight: "500",
    margin: 15,
  },
  checkDiv: {
    width: "100%",
    height: 50,
    backgroundColor: "#f3f3f3",
    alignSelf: "center",
    borderRadius: 15,
    margin: 3,
    marginTop: 20,
    marginVertical: 10,
    alignItems: "center",
  },
});
