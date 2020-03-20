import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import {
  TopNavigation,
  TextContainer,
  PrimaryButton,
  BottomNavigation
} from "../components";
import { colors } from "../theme";
import { stringifyFrequency } from "../variables";

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    backgroundColor: colors.blue100,
    paddingBottom: 50
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: "space-between"
  }
});

const SetReminderScreen = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
}) => {
  return (
    <View style={{ backgroundColor: colors.blue100, flex: 1 }}>
      <TopNavigation textSize="small" centerText="Set Reminder" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.center}>
          <Image
            source={require("../assets/statue_head.png")}
            style={{ width: 220, height: 331 }}
          />
        </View>
        <View
          style={{ borderBottomWidth: 1, borderBottomColor: colors.blue400 }}
        >
          <TextContainer
            leftText="Repeat"
            rightText={`Every ${stringifyFrequency(props.userData.frequency)}`}
            onPress={() => props.setScreen("setFrequency")}
          />
          <TextContainer
            leftText="Between"
            rightText={`${dateFns.format(
              props.userData.startTime,
              "HH:mm"
            )} and ${dateFns.format(props.userData.endTime, "HH:mm")}`}
            onPress={() => props.setScreen("setBetween")}
          />
        </View>
        <PrimaryButton text="Set" onPress={() => props.setScreen("home")} />
      </ScrollView>
      <BottomNavigation onPress={() => props.setScreen("home")} />
    </View>
  );
};

export default SetReminderScreen;
