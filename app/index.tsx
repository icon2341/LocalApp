import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import Mapbox from '@rnmapbox/maps';
import React, {Component, useEffect, useState} from "react";
import MapboxGL from "@rnmapbox/maps";
import { UserLocation } from '@rnmapbox/maps';
import * as Location from 'expo-location';


export default function Page() {
    const [GLReady, setGLReady] = useState(false);

    const [location, setLocation] = useState< any>(null);
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.error('Permission to access location was denied');

                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});

            setLocation(currentLocation.coords);
        })();
    }, []);

    MapboxGL.setWellKnownTileServer('Mapbox');
    MapboxGL.setConnected(true);
    Mapbox.setAccessToken('pk.eyJ1IjoiaWNvbjIzNDEiLCJhIjoiY2xwM3o2ZmVjMTF2MzJxbWo2aHRtMzA4NiJ9.s2Gs6pMoeWcwVPDj0kOHgg').then(
        () => {
            console.log('Mapbox GL ready to go!');
            setGLReady(true);
        }
    )
    if(!GLReady) return null;
    return (
        <SafeAreaProvider>
            <Mapbox.MapView style={styles.map}/>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: 300,
        width: 300,
        backgroundColor: "tomato"
    },
    map: {
        flex: 1
    }
});

