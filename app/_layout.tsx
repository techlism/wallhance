import "../global.css";
import { Stack }from "expo-router";

export default function Layout() {
  return (
  <Stack initialRouteName="index">
    <Stack.Screen name="search" options={{headerShown : false}} />
    <Stack.Screen name="index" options={{headerShown : false}} />
    <Stack.Screen name="download" options={{headerShown : false}} />
  </Stack>
  );
}
