import { fetchWallhavenImages } from "lib/functions";
import { WallhavenImageResponse } from "lib/types";
import React, { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Dimensions,
    Animated,
    TextInput,
    Text,
    KeyboardAvoidingView,
} from "react-native";
import PulseSkeleton from "components/PulseSkeleton";
import { StatusBar } from "expo-status-bar";
import REAnimated, {
    Easing,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import Search from "./search";

function addAlphaToHex(hex: string = "#ffffff", alpha: number = 0.8) {
    if (hex.startsWith("#")) {
        hex = hex.substring(1);
    }

    if (hex.length !== 6) {
        throw new Error("Invalid hex color");
    }

    const alphaHex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${hex}${alphaHex}`;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function App() {
    const { query , color } = useLocalSearchParams();
    // state variables
    const [searchQuery, setSearchQuery] = useState<string>(
        (query as string) || ""
    );
    const [colorQuery, setColorQuery] = useState<string>((color as string) || "");
    const [wallhavenImages, setWallhavenImages] = useState<
        Map<string, WallhavenImageResponse>
    >(new Map());
    const [currentImageLoaded, setCurrentImageLoaded] = useState<
        Map<string, boolean>
    >(new Map());
    const [currentlySelectedImage, setCurrentlySelectedImage] = useState<
        WallhavenImageResponse | undefined
    >(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    // animation variables
    const scrollX = useRef(new Animated.Value(0)).current;
    const opacity = useSharedValue(1);

    // functions
    async function updateCurrentImageLoaded(id: string, loaded: boolean) {
        setCurrentImageLoaded((prev) => new Map(prev).set(id, loaded));
    }

    async function loadWallhaven(query: string, page: number = 1) {
        let response : WallhavenImageResponse[] = [];
        if(colorQuery){
            response = await fetchWallhavenImages(query, page, `&colors=${color}`);
        }
        else{
            response = await fetchWallhavenImages(query, page);
        }
        if (response.length === 0) return;

        setWallhavenImages((prev) => {
            const updatedMap = new Map(prev);
            response.forEach((image) => {
                updatedMap.set(image.id, image);
            });
            return updatedMap;
        });
        if (page === 1) setCurrentlySelectedImage(response[0]);
    }

    async function findCurrentImage(viewableItems: {
        viewableItems: any;
        changed: any;
    }) {
        if (viewableItems.viewableItems.length > 0) {
            const currentItem = viewableItems.viewableItems[0].item;
            setCurrentlySelectedImage(currentItem);
            // Trigger animation
            opacity.value = 0;
            opacity.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.bezierFn(0.17, 1.24, 0.56, 1.54)),
            });
        }
    }

    // some configs
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 35,
    };
    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged: findCurrentImage },
    ]);

    useEffect(() => {
        if (wallhavenImages.size === 0) loadWallhaven(searchQuery, currentPage);
    }, [wallhavenImages, searchQuery]);

    useEffect(() => {
        if (
            currentlySelectedImage &&
            wallhavenImages.size > 1 &&
            Array.from(wallhavenImages.values()).indexOf(
                currentlySelectedImage
            ) ===
                wallhavenImages.size - 1
        ) {
            setCurrentPage((prev) => prev + 1);
            setTimeout(() => {}, 300); // creating an artificial delay
            loadWallhaven(searchQuery, currentPage);
        }
    }, [currentlySelectedImage, searchQuery]);

    // animation hooks
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });
    const { top, left } = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            <View style={StyleSheet.absoluteFillObject}>
                <REAnimated.Image
                    source={{
                        uri:
                            currentlySelectedImage?.path ||
                            "https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg"
                    }}
                    style={[StyleSheet.absoluteFillObject, animatedStyle]}
                    blurRadius={70}
                />
            </View>
            <StatusBar
                animated
                translucent
                networkActivityIndicatorVisible={false}
            />
            {/* Search Bar */}
            <Link
                href={`/search?bg_uri=${currentlySelectedImage?.path}`}
                className={`text-gray-100 bg-transparent rounded-xl border-2 w-[90%] text-xl flex justify-center align-middle p-4 text-center font-medium`}
                style={{
                    marginLeft: left,
                    marginRight: left,
                    marginTop: top + 20,
                    backgroundColor: addAlphaToHex(
                        currentlySelectedImage?.colors?.[0],
                        0.2
                    ),
                    opacity: 0.9,
                    borderColor: addAlphaToHex(
                        currentlySelectedImage?.colors?.[1],
                        0.35
                    ),
                }}
            >
                <Text>Search</Text>
            </Link>
            <Animated.FlatList
                data={Array.from(wallhavenImages.values())}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {
                        useNativeDriver: true,
                    }
                )}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ];
                    const translateX = scrollX.interpolate({
                        inputRange,
                        outputRange: [-width * 0.6, 0, width * 0.6],
                    });
                    return (
                        <View
                            style={{
                                width,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                        <Link href={`/download?bg_uri=${item?.path}&file_name=${item.id}&file_type=${item.file_type}`}>

                                <View
                                    style={{
                                        width: ITEM_WIDTH,
                                        height: ITEM_HEIGHT,
                                        overflow: "hidden",
                                        alignItems: "center",
                                        borderRadius: 14,
                                        backgroundColor: "transparent",
                                    }}
                                    className="shadow-lg border-white"
                                >
                                    {((currentImageLoaded.get(item.id) &&
                                        currentImageLoaded.get(item.id) ===
                                            false) ||
                                        !currentImageLoaded.get(item.id)) && (
                                        <PulseSkeleton />
                                    )}
                                    <Animated.Image
                                        source={{
                                            uri: item.path,
                                            height: item.dimension_y,
                                            width: item.dimension_x,
                                        }}
                                        style={{
                                            width: ITEM_WIDTH * 1.12,
                                            height: ITEM_HEIGHT * 1.2,
                                            resizeMode: "cover",
                                            transform: [
                                                {
                                                    translateX,
                                                },
                                            ],
                                            display:
                                                currentImageLoaded.get(
                                                    item?.id
                                                ) === false
                                                    ? "none"
                                                    : "flex",
                                        }}
                                        onLoadStart={() =>
                                            updateCurrentImageLoaded(
                                                item.id,
                                                false
                                            )
                                        }
                                        onLoadEnd={() =>
                                            updateCurrentImageLoaded(
                                                item.id,
                                                true
                                            )
                                        }
                                    />
                                </View>
                                </Link>
                            </View>                    
                    );
                }}
            />
        </SafeAreaView>
    );
}
