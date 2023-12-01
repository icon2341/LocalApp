import {StyleSheet, Button, Pressable, Text, View} from 'react-native';
import { Appearance, useColorScheme } from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, {useCallback, useEffect, useState} from "react";
import {Video, ResizeMode, AVPlaybackSource} from 'expo-av';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import {
    SplashScreen,
} from 'expo-router';
import {JosefinSans_700Bold} from "@expo-google-fonts/josefin-sans";
import {Roboto_300Light} from "@expo-google-fonts/roboto";
import * as Location from 'expo-location';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



SplashScreen.preventAutoHideAsync();

export default function Page() {

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    let [fontsLoaded, fontError] = useFonts({
        Inter_900Black,
        JosefinSans_700Bold,
        Roboto_300Light
    });

    useEffect(() => {
        (async () => {
            await AsyncStorage.getItem('askedForLocation').then((value : string | null) => {
                if(value === 'true') {
                    SplashScreen.hideAsync();
                    router.replace('/mapview');
                }
            })
        })();
    });

    const [videoLoaded, setVideoLoaded] = useState(false);

    const onLayoutRootView = useCallback(async () => {
        console.log("checking loaded state", fontsLoaded, videoLoaded);

        if ((fontsLoaded && videoLoaded) || fontError) {
            console.log("loaded stuff")
            if(fontError) {
                setErrorMsg("Could not load fonts, try restarting the app.")
            }
        return }
    }, [fontsLoaded, fontError, videoLoaded]);




    let colorScheme = useColorScheme();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    if (!fontsLoaded && !fontError) {
        return null;
    }


    return (
        <SafeAreaProvider>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onLayout={onLayoutRootView}>
                <Video
                    ref={video}
                    style={StyleSheet.absoluteFill}
                    source={require('../assets/Local_Splash_Background.mp4')}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={true}
                    isLooping={true}
                    rate={4}
                    onLoad={() => {SplashScreen.hideAsync();}}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.mainTitle, {fontFamily: 'JosefinSans_700Bold'}]}>Local</Text>
                    <Text style={[styles.subTitle, {fontFamily: 'Roboto_300Light'}]}>Find things to do.</Text>
                    <Text style={styles.actionText}>Provide us location access to get started.</Text>
                    <Pressable style={styles.button} onPress={() => {requestUserLocation().then(r => console.log(r) ).catch(reason => {console.error(reason)}).then(() => {router.replace('/mapview')})}}>
                        <Text style={styles.buttonText}>Request Location</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={styles.notInterestedText}>Skip for now</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaProvider>
    );

}

async function requestUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    await AsyncStorage.setItem('askedForLocation', 'true');

    if (status !== 'granted') {
        alert('Permission to access location was denied');
        return Promise.reject('Permission to access location was denied');
    }

    return Promise.resolve('Permission to access location was granted');
}


const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 64,
        color: 'white',
        textAlign: 'center',},
    subTitle: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '200',
        color: 'white',

    },

    button: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 5,
        // fontFamily: ['Inter_900Black'],
        fontWeight: '900',
        marginTop: '10%',

    },
    buttonText: {
        fontWeight: '900',
        fontSize: 28,
        color: 'black',
    },
    actionText:{
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto_300Light',
        marginTop: '50%',
        width: 250,

    },
    notInterestedText:{
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto_300Light',
        marginTop: '10%',
        width: 250,
    }
});