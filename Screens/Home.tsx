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
    justifyContent: "space-between",
    flexDirection: "column",
    fontFamily: "Cochin"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  textWrapper: {
    marginHorizontal: 24,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
    color: colors.blue800
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.blue800,
    marginBottom: 12
  },
  smallImage: {
    width: 220,
    height: 331
  },
  bigImage: {
    width: 300,
    height: 451
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
    <Text>A quote will be sent every</Text>
    <Text
      style={{ fontWeight: "600" }}
      children={` ${stringifyFrequency(props.userData.frequency)} `}
    />
    <Text>between</Text>
    <Text
      style={{ fontWeight: "600" }}
      children={` ${dateFns.format(props.userData.startTime, "HH:mm")} `}
    />
    <Text>and</Text>
    <Text
      style={{ fontWeight: "600" }}
      children={` ${dateFns.format(props.userData.endTime, "HH:mm")} `}
    />
  </Text>
);

const ShowReminder = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
}) => (
  <View style={{ alignItems: "center" }}>
    <Text children="Reminder set" style={styles.textHeader} />
    <ReminderText userData={props.userData} />
  </View>
);

const Home = (props: { userData: UserDataT; setScreen: SetScreenFn }) => {
  return (
    <View style={styles.container}>
      <TopNavigation centerText="Stoic Reminders" />
      <View style={styles.center}>
        <Image
          source={require("../assets/statue_head.png")}
          style={props.userData ? styles.smallImage : styles.bigImage}
        />
      </View>

      {props.userData && (
        <ShowReminder userData={props.userData} setScreen={props.setScreen} />
      )}

      <PrimaryButton
        text={props.userData ? "Edit" : "Set Reminder"}
        onPress={() => props.setScreen("setReminder")}
      />
    </View>
  );
};

export default Home;
