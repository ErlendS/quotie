import React from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import { colors } from "../theme";
import { Button, TopNavigation, AppText } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue100,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  textWrapper: {
    marginHorizontal: 24,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 18,
    color: colors.blue800
  },
  textHeader: {
    fontSize: 22,
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
  <AppText style={styles.textWrapper}>
    <AppText>A quote will be sent every</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${stringifyFrequency(props.userData.frequency)} `}
    />
    <AppText>between</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${dateFns.format(props.userData.startTime, "HH:mm")} `}
    />
    <AppText>and</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${dateFns.format(props.userData.endTime, "HH:mm")} `}
    />
  </AppText>
);

const ShowReminder = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
}) => (
  <>
    <AppText
      fontWeight="SemiBold"
      children="Reminder set"
      style={styles.textHeader}
    />
    <ReminderText userData={props.userData} />
  </>
);

const Home = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
  cancelReminder: () => void;
}) => {
  return (
    <View style={styles.container}>
      <TopNavigation centerText="Stoic Reminders" />
      <View style={[styles.center, { marginBottom: 40 }]}>
        <Image
          source={require("../assets/statue_head.png")}
          style={props.userData ? styles.smallImage : styles.bigImage}
        />
      </View>
      <View
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        {props.userData.reminderEnabled ? (
          <ShowReminder userData={props.userData} setScreen={props.setScreen} />
        ) : (
          <AppText
            style={{ color: colors.blue800, fontSize: 24 }}
            fontWeight="SemiBold"
            children="No Reminder Set"
          />
        )}
      </View>
      <View style={[styles.center, { marginBottom: 48 }]}>
        <Button
          text={props.userData.reminderEnabled ? "Edit" : "Set Reminder"}
          onPress={() => props.setScreen("setReminder")}
        />
        {props.userData.reminderEnabled && (
          <Button
            secondary={true}
            text="Cancel Reminder"
            onPress={() =>
              Alert.alert("Cancel Reminder?", "", [
                { text: "No", onPress: () => null, style: "cancel" },
                { text: "Yes", onPress: props.cancelReminder }
              ])
            }
          />
        )}
      </View>
    </View>
  );
};

export default Home;
