import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import * as dateFns from "date-fns";

import { colors } from "./theme";

const styles = StyleSheet.create({
  containerText: {
    color: colors.black
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
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: colors.blue200,
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
    fontSize: 37,
    fontWeight: "400"
  },
  titleSmall: {
    color: colors.blue900,
    fontSize: 28,
    fontWeight: "400"
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
    marginBottom: 24
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
      <Text
        style={props.textSize === "small" ? styles.titleSmall : styles.title}
      >
        {props.centerText}
      </Text>
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
    <Text style={styles.containerText}>{leftText}</Text>
    <Text style={styles.containerText}>{rightText}</Text>
  </TouchableOpacity>
);

const SelectableContainerText = ({ label, value, selected, onPress }) => (
  <TouchableOpacity style={styles.selectors} onPress={() => onPress(value)}>
    <Text style={styles.containerText}>{label}</Text>
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
    <Text
      style={{ fontSize: 14, color: colors.blue800 }}
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
            backgroundColor: colors.blue100,
            borderTopWidth: 1
          }
    ]}
    onPress={() => props.onPress()}
  >
    <Text
      style={{
        color: props.active ? colors.blue800 : colors.blue600,
        fontWeight: "500"
      }}
      children={props.topText}
    />
    <Text
      style={{
        color: props.active ? colors.blue800 : colors.blue600,
        fontWeight: "700"
      }}
      children={props.bottomText}
    />
  </TouchableOpacity>
);

export {
  PrimaryButton,
  TopNavigation,
  TextContainer,
  SelectableContainerText,
  BottomNavigation,
  Tabs,
  Tab
};
