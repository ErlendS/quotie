import React from "react";
import * as Font from "expo-font";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextStyle
} from "react-native";
import { Icon } from "react-native-elements";
import * as dateFns from "date-fns";

import { colors } from "./theme";

const styles = StyleSheet.create({
  containerText: {
    color: colors.blue800
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: colors.white,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    paddingHorizontal: 16
  },
  selectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: colors.white,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    paddingHorizontal: 16
  },
  buttonStyle: {
    backgroundColor: colors.white,
    height: 51,
    width: "70%",
    borderStyle: "solid",
    borderColor: colors.blue700,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  buttonText: {
    textAlign: "center",
    flexGrow: 1,
    color: colors.blue800
  },
  secondaryButtonStyle: {
    height: 51,
    width: "auto",
    alignItems: "center",
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
    height: 60,
    width: "50%",
    borderTopWidth: 3,
    borderTopColor: colors.focused,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end"
  },
  title: {
    color: colors.blue900,
    fontSize: 37
  },
  titleSmall: {
    color: colors.blue900,
    fontSize: 28
  },
  topNavigationContainer: {
    marginTop: 28,
    height: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  bottomNavigation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32
  }
});

type FontWeightVariants = "SemiBold" | "Medium" | "Bold";

const AppText = (props: {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  fontWeight?: FontWeightVariants;
}) => {
  const fontType = !props.fontWeight ? "Regular" : props.fontWeight;
  return (
    <Text style={[{ fontFamily: `Montserrat-${fontType}` }, props.style]}>
      {props.children}
    </Text>
  );
};

const Button = (props: {
  text: string;
  onPress: () => void;
  secondary?: boolean;
}) => (
  <View>
    <TouchableOpacity
      style={props.secondary ? styles.secondaryButtonStyle : styles.buttonStyle}
      onPress={props.onPress}
      activeOpacity={0.4}
    >
      <AppText
        fontWeight="Medium"
        style={[
          props.secondary && { textDecorationLine: "underline" },
          styles.buttonText
        ]}
      >
        {props.text}
      </AppText>
    </TouchableOpacity>
  </View>
);

const TopNavigation = (props: {
  leftIcon?: React.ReactNode;
  centerText: string;
  rightIcon?: React.ReactNode;
  textSize?: "small" | "medium";
}) => {
  const placeholder = (
    <View
      style={{
        width: 30
      }}
    />
  );
  return (
    <View style={styles.topNavigationContainer}>
      {props.leftIcon ? props.leftIcon : placeholder}
      <AppText
        fontWeight="SemiBold"
        style={props.textSize === "small" ? styles.titleSmall : styles.title}
      >
        {props.centerText}
      </AppText>
      {props.rightIcon ? props.rightIcon : placeholder}
    </View>
  );
};

const TextContainer = ({ leftText, rightText, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.textContainer}
    activeOpacity={1}
  >
    <AppText fontWeight="Medium" style={styles.containerText}>
      {leftText}
    </AppText>
    <AppText style={styles.containerText}>{rightText}</AppText>
  </TouchableOpacity>
);

const SelectableContainerText = ({ label, value, selected, onPress }) => (
  <TouchableOpacity style={styles.selectors} onPress={() => onPress(value)}>
    <AppText style={styles.containerText}>{label}</AppText>
    {selected ? (
      <Icon name="check" type="feather" color={colors.black} size={15} />
    ) : null}
  </TouchableOpacity>
);

const BottomNavigation = (props: { onPress: () => void; text?: string }) => (
  <TouchableOpacity
    onPress={() => props.onPress()}
    style={styles.bottomNavigation}
  >
    <Icon name="chevron-left" type="feather" color={colors.blue800} size={24} />
    <AppText
      fontWeight="SemiBold"
      style={{ fontSize: 18, color: colors.blue800 }}
      children={props.text || "Back"}
    />
  </TouchableOpacity>
);
const Tabs = (props: { children: React.ReactNode }) => {
  const count = React.Children.count(props.children);
  console.warn("count is", count);
  const activeBarLength = Math.floor(100 / count);
  const activeBarPlacement = activeBarLength * (count - 1);

  const ActiveBar = () => (
    <>
      <View
        style={{
          width: `${activeBarPlacement}%`,
          height: 1,
          backgroundColor: colors.blue200
        }}
      />
      <View
        style={{
          width: `${activeBarLength}%`,
          height: 3,
          backgroundColor: colors.focused
        }}
      />
    </>
  );
  return (
    <View>
      <ActiveBar />
      <View style={{ flexDirection: "row" }}>{props.children}</View>
    </View>
  );
};

const Tab = (props: {
  topText: string;
  bottomText: string;
  onPress: () => void;
  active: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.tabsContainer,
      props.active
        ? null
        : {
            borderTopColor: colors.blue200,
            backgroundColor: colors.white,
            borderTopWidth: 1
          }
    ]}
    onPress={() => props.onPress()}
  >
    <AppText
      fontWeight="Medium"
      style={{
        color: props.active ? colors.blue800 : colors.blue500
      }}
      children={props.topText}
    />
    <AppText
      fontWeight="Bold"
      style={{
        color: props.active ? colors.blue800 : colors.blue500
      }}
      children={props.bottomText}
    />
  </TouchableOpacity>
);

export {
  Button,
  TopNavigation,
  TextContainer,
  SelectableContainerText,
  BottomNavigation,
  Tabs,
  Tab,
  AppText
};
