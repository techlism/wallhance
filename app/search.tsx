import {
    TextInput,
    View,
    Image,
    Text,
    StyleSheet,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    TextInputEndEditingEventData,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const colors = [
    "#660000",
    "#990000",
    "#cc0000",
    "#cc3333",
    "#ea4c88",
    "#993399",
    "#663399",
    "#333399",
    "#0066cc",
    "#0099cc",
    "#66cccc",
    "#77cc33",
    "#669900",
    "#336600",
    "#666600",
    "#999900",
    "#cccc33",
    "#ffff00",
    "#ffcc33",
    "#ff9900",
    "#ff6600",
    "#cc6633",
    "#996633",
    "#663300",
    "#000000",
    "#cccccc",
    "#ffffff",
    "#424153",
];

export default function Search() {
    const { bg_uri } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState("");

    function handleSearchQueryChange(
        event: NativeSyntheticEvent<TextInputChangeEventData>
    ) {
        event.preventDefault();
        setSearchQuery(event.nativeEvent.text);
    }

    function submitQuery(
        event? : NativeSyntheticEvent<TextInputEndEditingEventData> , color? : string
    ) {
        if(event && !color && searchQuery){
            event.preventDefault();
            router.replace("/?query=" + searchQuery);
        }        
        if(!event && color){

            router.replace("/?color=" + color.split("#")[1]);
        }
    }
    


    return (
        <View className="flex-1 justify-center align-top p-4">
            <View style={StyleSheet.absoluteFillObject}>
                <Image
                    source={{
                        uri: (bg_uri as string) || "..assets/bg_light.svg",
                    }}
                    style={[StyleSheet.absoluteFillObject]}
                    blurRadius={70}
                />
            </View>
            <KeyboardAvoidingView>
                <TextInput
                    autoFocus
                    onFocus={() => setSearchQuery("")}
                    value={searchQuery}
                    placeholder="Search for wallpapers"
                    onChange={(event) => handleSearchQueryChange(event)}
                    onEndEditing={(event) => submitQuery(event,undefined)}
                    enterKeyHint={"search"}
                    className="rounded-xl border-2 w-full h-20 bg-transparent text-xl font-semibold p-4 text-white placeholder:text-white border-white"
                />
                <View className="h-1 bg-white my-4 mx-2 rounded-xl opacity-45" />
                <ScrollView className="flex mx-2 px-6 max-h-52 rounded-xl" style={{backgroundColor : '#ffffff70'}}>
                    <Text className="text-white font-semibold text-center text-lg">
                        Search By Colors
                    </Text>
                    <View className="flex-row flex-wrap justify-around align-middle py-2 pb-6">
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => submitQuery(undefined, color)}
                            >
                                <View
                                    className="rounded-xl h-12 w-12 m-2 border-black border-2"
                                    style={{ backgroundColor: color }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
