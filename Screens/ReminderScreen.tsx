import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as dateFns from "date-fns";

import { UserSettingsT, SetScreenFn } from "../types";
import {
  TopNavigation,
  TextContainer,
  Button,
  BackgroundImage
} from "../components";
import { colors, spacing } from "../theme";
import { stringifyFrequency } from "../variables";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue100,
    flex: 1,
    paddingTop: spacing[5]
  },
  scrollViewContainer: {
    backgroundColor: "transparent",
    paddingBottom: spacing[7]
  },
  scrollViewContentContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  actionsWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    width: "100%",
    marginBottom: spacing[7]
  }
});

const ReminderScreen = (props: {
  userData: UserSettingsT;
  setScreen: SetScreenFn;
  onSubmit: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { startTime, endTime, frequency } = props.userData;

  return (
    <View style={styles.container}>
      <TopNavigation textSize="small" centerText="Set Reminder" />
      <BackgroundImage placement="oneThird" />

      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContentContainerStyle}
      >
        <View style={styles.actionsWrapper}>
          <TextContainer
            leftText="Repeat"
            rightText={`Every ${stringifyFrequency(frequency)}`}
            onPress={() => props.setScreen("setFrequency")}
          />
          <TextContainer
            leftText="Between"
            rightText={`${dateFns.format(
              startTime,
              "HH:mm"
            )} and ${dateFns.format(endTime, "HH:mm")}`}
            onPress={() => props.setScreen("setBetween")}
          />
        </View>
        <Button
          text={isSubmitting ? "Setting..." : "Set Reminder"}
          onPress={() => {
            isSubmitting ? null : setIsSubmitting(true);
            !isSubmitting && props.onSubmit();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ReminderScreen;
