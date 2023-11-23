import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';
import Mapbox from '@rnmapbox/maps';
import MapboxGL from '@rnmapbox/maps';
import React, {useEffect, useState} from "react";
Mapbox.setAccessToken('pk.eyJ1IjoiaWNvbjIzNDEiLCJhIjoiY2xwM3o2ZmVjMTF2MzJxbWo2aHRtMzA4NiJ9.s2Gs6pMoeWcwVPDj0kOHgg').then(
    () => {
        console.log('Mapbox GL ready to go!');
        MapboxGL.requestAndroidLocationPermissions().then(r => console.log(r));
    }
)
export default function Page() {

    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    MapboxGL.setConnected(true);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            await Location.watchPositionAsync({accuracy: LocationAccuracy.Highest},
                (r) => {console.log("LOCATION: "+ r.coords.longitude); setLocation(r.coords)});
        })();
    }, []);

    return (
        <SafeAreaProvider>
            <View style={styles.page}>
                <View style={styles.container}>
                    <MapboxGL.MapView style={styles.map} >
                        <MapboxGL.Camera
                            zoomLevel={15}
                            followUserLocation={true}
                        />
                        <MapboxGL.UserLocation minDisplacement={2} visible={true} animated={true}/>
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
    }
});
