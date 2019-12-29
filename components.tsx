import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "./theme";

const styles = StyleSheet.create({
  primaryButtonStyle: {
    backgroundColor: colors.white,
    height: 51,
    width: "70%",
    borderStyle: "solid",
    borderColor: colors.blue800,
    borderWidth: 1,
    color: colors.blue900,
    borderRadius: 3,
    alignItems: "center",
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  title: {
    color: colors.blue900,
    fontSize: 37,
    fontWeight: "400"
  },
  navigationContainer: {
    marginTop: 44,
    height: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  }
});

const PrimaryButton = (props: {
  text: string;
  icon?: React.ReactNode;
  onPress: () => void;
}) => (
  <View
    style={{
      height: "15%",
      width: "100%",
      alignItems: "center"
    }}
  >
    <TouchableOpacity
      style={styles.primaryButtonStyle}
      onPress={props.onPress}
      activeOpacity={0.4}
    >
      {props.icon ? (
        <View
          style={{
            width: 30
          }}
        />
      ) : null}
      <Text style={{ textAlign: "center", flexGrow: 1 }}>{props.text}</Text>
      {props.icon}
    </TouchableOpacity>
  </View>
);

const TopNavigation = (props: {
  leftIcon?: React.ReactNode;
  centerText: string;
  rightIcon?: React.ReactNode;
}) => {
  const placeholder = (
    <View
      style={{
        width: 30
      }}
    />
  );
  return (
    <View style={styles.navigationContainer}>
      {props.leftIcon ? props.leftIcon : placeholder}
      <Text style={styles.title}> {props.centerText}</Text>
      {props.rightIcon ? props.rightIcon : placeholder}
    </View>
  );
};

export { PrimaryButton, TopNavigation };
