import {Text, View} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import { View as AnimatedView } from 'react-native-animatable';
import MapboxGL, {PointAnnotation, UserLocation} from "@rnmapbox/maps";
import {StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {LocationAccuracy} from "expo-location";
MapboxGL.setAccessToken('pk.eyJ1IjoiaWNvbjIzNDEiLCJhIjoiY2xwOWp3NXg0MDJ4YTJ2cDloOWF5OWp0bSJ9.HLO281Tv3fB3GMtZRYXk3A')

export default function Mapview() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.watchPositionAsync({accuracy: LocationAccuracy.Highest},
                (location) => {setLocation(location); console.log(location)});
        })();

    }, []);


    return (
        <SafeAreaProvider>
            <View style={styles.page}>
                <View style={styles.container}>
                    <MapboxGL.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/light-v11"}  >
                        <MapboxGL.PointAnnotation
                            id="currentLocation"
                            coordinate={[location?.coords.longitude ?? 0, location?.coords.latitude ?? 0]}>
                            <View style={isPressed ? styles.circle : styles.circleBlue}>
                            </View>

                        </MapboxGL.PointAnnotation>
                    </MapboxGL.MapView>

                </View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        flex: 1
    },
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "tomato"
    },
    map: {
        flex: 1
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: "rgba(255,0,144,0.5)"
    },
    circleBlue: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: "rgba(0,0,255,0.5)"
    }
});