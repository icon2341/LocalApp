import { Stack } from 'expo-router/stack';
import {ScreenStack} from "react-native-screens";
import {Slot} from "expo-router";

export default function Layout() {
    return <Stack screenOptions={{headerShown:false}} />;
}