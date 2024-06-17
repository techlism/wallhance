import "../global.css";
import { Stack }from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
export default function Layout() {
  return (
  <Stack initialRouteName="index">
    <Stack.Screen name="search" options={{headerShown : false}} />
    <Stack.Screen name="index" options={{headerShown : false}} />
    <Stack.Screen name="download" options={{headerShown : false}} />
  </Stack>
  );
}
