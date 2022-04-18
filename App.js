import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function askLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      const weatherApiUrl = `${WEATHER_API_BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
      const response = await fetch(weatherApiUrl);
      const result = await response.json();

      if (response.ok) {
        setWeather(result);
        console.log('result', result);
      } else {
        setErrorMsg(result?.message);
      }
    } catch (error) {
      setErrorMsg('Something went wrong.');
    }
  }
  useEffect(() => askLocation(), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text numberOfLines={1} onPress={() => console.log('text clicked')}>
        {weather ? weather?.main?.temp : errorMsg}
      </Text>
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
