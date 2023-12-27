import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const [selected, setSelected] = useState("police");
  const [sent, setSent] = useState(false);

  const Sendrequest = () => {
    axios.post(`https://hereapi-emergency.up.railway.app/create_emergency?lat=${location.coords.latitude}&lng=${location.coords.longitude}&alt=${location.coords.altitude}&accuracy=${location.coords.accuracy}&name=Unknown`).then(() => {
      setSent(true)
    })
  }

  return (
    <View style={styles.container}>

      <View style={{
        flexDirection: "row",
        gap: 5
      }}>
        <TouchableOpacity style={{ padding: 5, borderRadius: 10, alignItems: "center" }} onPress={() => {setSelected("police")}}>
          <MaterialIcons name="local-police" size={24} color="black" style={{ padding: 10, borderRadius: 10, backgroundColor: selected === "police" ? "lightblue" : "gray" }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, borderRadius: 10, backgroundColor: selected === "ambulance" ? "lightblue" : "gray" }} onPress={() => {setSelected("ambulance")}}>
          <FontAwesome name="ambulance" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{ marginTop: 10, padding: 10, borderRadius: 10, width: '40%' }}>
        <Button title="Request Emergency" onPress={Sendrequest} />
      </View>
      {
        sent && 
        <Text style={styles.paragraph}>Request Sent</Text>
      }
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
