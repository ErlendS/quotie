import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { UserDataT, SetScreenFn } from "../types";
import {
  TopNavigation,
  SelectableContainerText,
  BottomNavigation
} from "../components";

import { colors } from "../theme";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.blue100,
    fontFamily: "Cochin"
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: "space-between"
  },
  selectorWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    marginBottom: 40
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
});

const frequencyOptions = [
  {
    label: "Every hour",
    value: 60
  },
  {
    label: "Every 2 hrs",
    value: 120
  },
  {
    label: "Every 4 hrs",
    value: 240
  },
  {
    label: "Every 6 hrs",
    value: 360
  }
];

const SetFrequency = (props: {
  setScreen: SetScreenFn;
  frequency: number;
  setFrequency: (value: number) => void;
  userData: UserDataT;
}) => {
  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <TopNavigation textSize="small" centerText="Repeat" />
      <View style={styles.center}>
        <Image
          source={require("../assets/statue_head_new.png")}
          style={{ width: 200, height: 300, opacity: 0.5 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.selectorWrapper}>
          {frequencyOptions.map((option, key) => {
            return (
              <SelectableContainerText
                key={key}
                label={option.label}
                value={option.value}
                onPress={() => {
                  props.setFrequency(option.value);
                }}
                selected={props.userData.frequency === option.value}
              />
            );
          })}
        </View>
        <BottomNavigation
          text="Save"
          onPress={() => props.setScreen("setReminder")}
        />
      </View>
    </ScrollView>
  );
};

export default SetFrequency;
