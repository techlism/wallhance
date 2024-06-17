import React from 'react';
import { StyleSheet, Animated, Easing, View } from 'react-native';

const PulseSkeleton = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 400,
          easing: Easing.inOut(Easing.bezier(0.5, 0.5, 0.5, 0.5)),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.bounce),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, { opacity: pulseAnim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
  },
  line: {
    width: '92.5%',
    height: '95%',
    backgroundColor: '#888888',
    borderRadius: 12,
  },
});

export default PulseSkeleton;
