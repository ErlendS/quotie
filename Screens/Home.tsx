import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import * as dateFns from "date-fns";
import { Icon } from "react-native-elements";

import { UserDataT, SetScreenFn } from "../types";
import { colors } from "../theme";
import { PrimaryButton, TopNavigation } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontFamily: "Cochin"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  textWrapper: {
    marginHorizontal: 16,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
    color: colors.blue800
  }
});

function stringifyFrequency(frequency) {
  if (frequency === 60) return "hour";
  if (frequency === 120) return "2 hrs";
  if (frequency === 240) return "4 hrs";
  if (frequency === 360) return "6 hrs";
}

const ReminderText = (props: { userData: UserDataT }) => (
  <Text style={styles.textWrapper}>
    A quote will be sent every{" "}
    <Text style={{ fontWeight: "600" }}>
      {stringifyFrequency(props.userData.frequency)}
    </Text>{" "}
    starting from{" "}
    <Text style={{ fontWeight: "600" }}>
      {dateFns.format(props.userData.startTime, "HH:mm")}
    </Text>{" "}
    ending{" "}
    <Text style={{ fontWeight: "600" }}>
      {dateFns.format(props.userData.endTime, "HH:mm")}
    </Text>
  </Text>
);

const ShowReminder = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
}) => (
  <View style={{ flexGrow: 1, alignItems: "center" }}>
    <ReminderText userData={props.userData} />
    <PrimaryButton text="Edit" onPress={() => props.setScreen("setReminder")} />
  </View>
);

const Home = (props: { userData: UserDataT; setScreen: SetScreenFn }) => {
  return (
    <View style={styles.container}>
      <TopNavigation centerText="Stoic Reminders" />
      <View style={(styles.center, { flexGrow: 2 })}>
        <Image
          source={require("../assets/statue_head.png")}
          style={{ width: 220, height: 331 }}
        />
      </View>

      {props.userData ? (
        <ShowReminder userData={props.userData} setScreen={props.setScreen} />
      ) : (
        <PrimaryButton
          text="Set Reminder"
          icon={
            <Icon
              name="chevron-right"
              type="feather"
              color={colors.black}
              size={30}
            />
          }
          onPress={() => props.setScreen("setReminder")}
        />
      )}
    </View>
  );
};

export default Home;
