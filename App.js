import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView
} from "react-native";
import { Permissions, Notifications } from "expo";
import { Icon } from "react-native-elements";
import * as dateFns from "date-fns";

import quotes from "./quotes";
import db from "./firebase";

function importQuotes() {
  quotes.map(quoteObj =>
    db
      .collection("quotes")
      .add(quoteObj)
      .then(docRef => console.log("Document written with ID:", docRef.id))
      .catch(err => console.error("Error adding document: ", err))
  );
}

const PUSH_ENDPOINT =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/setSubscription";

const PUSH_ENDPOINT2 =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/sendNotificationToSubscribedMembers";

const PUSH_POINT_USER_DATA =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/getUserNotificationSettings";

async function testFn() {
  await fetch(PUSH_ENDPOINT2, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}
async function getUserNotificationSettings() {
  try {
    let token = await Notifications.getExpoPushTokenAsync();
    return await fetch(PUSH_POINT_USER_DATA, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });
  } catch (error) {
    console.error(error);
  }
}

async function registerForPushNotificationsAsync(
  userNotificationRequest,
  onSuccess
) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();

  const response = await fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      data: userNotificationRequest
    })
  });
  console.log("respone is:", response.ok);
  if (response.ok) {
    return onSuccess();
  } else return;
}

export default class App extends React.Component {
  state = {
    screen: "home",
    userData: {
      startTime: setInitalTime(),
      endTime: dateFns.addHours(setInitalTime(), 12),
      frequency: 60
    },
    frequencyOptions: [
      {
        label: "Every 30 min",
        value: 30
      },
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
      }
      // {
      //   label: "Every 6 hrs",
      //   value: 360
      // }
    ]
  };
  async componentDidMount() {
    let userData = await getUserNotificationSettings();
    console.log("User notification settin is ", userData);
    if (userData) {
      this.setState({
        userData: {
          ...this.state.userData,
          startTime: userData.startTime,
          endTime: userData.endTime,
          frequency: userData.frequency
        }
      });
    }
  }
  setStartTime = newTime =>
    this.setState({ userData: { ...this.state.userData, startTime: newTime } });
  setEndTime = newTime =>
    this.setState({ userData: { ...this.state.userData, endTime: newTime } });

  setFrequency = value => {
    this.setState({
      userData: { ...this.state.userData, frequency: value }
    });
  };

  goToSetReminder = () => {
    this.setState({
      screen: "setReminder"
    });
  };
  onBackToHome = () => {
    this.setState({
      screen: "home"
    });
  };

  render() {
    if (this.state.screen === "setReminder") {
      return (
        <FrequencySelector
          backToHome={this.onBackToHome}
          setStartTime={this.setStartTime}
          setEndTime={this.setEndTime}
          setFrequency={this.setFrequency}
          frequencyOptions={this.state.frequencyOptions}
          userData={this.state.userData}
        />
      );
    } else {
      return (
        <Home
          setReminder={this.goToSetReminder}
          userData={this.state.userData}
        />
      );
    }
  }
}

const TimePeriod = ({ title, time, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.timeSelectors}
    activeOpacity={1}
  >
    <Text style={styles.baseText}>{title}</Text>
    <Text style={styles.baseText}>{time}</Text>
  </TouchableOpacity>
);
const FrequencyOption = ({ label, value, selected, onPress }) => (
  <TouchableOpacity style={styles.selectors} onPress={() => onPress(value)}>
    <Text style={styles.baseText}>{label}</Text>
    {selected ? (
      <Icon name="check" type="feather" color="#444444" size={15} />
    ) : null}
  </TouchableOpacity>
);

const PrimaryButton = ({ text, icon, onPress }) => (
  <View
    style={{
      height: "15%",
      width: "100%",
      alignItems: "center"
    }}
  >
    <TouchableOpacity
      style={styles.primaryButtonStyle}
      onPress={onPress}
      activeOpacity={0.4}
    >
      {icon ? (
        <View
          style={{
            width: 30
          }}
        />
      ) : null}
      <Text style={{ textAlign: "center", flexGrow: 1 }}>{text}</Text>
      {icon}
    </TouchableOpacity>
  </View>
);

const TopNav = ({ leftIcon, centerText, rightIcon }) => {
  const placeholder = (
    <View
      style={{
        width: 30
      }}
    />
  );
  return (
    <View
      style={{
        marginTop: 44,
        height: 100,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around"
      }}
    >
      {leftIcon ? leftIcon : placeholder}
      <Text style={styles.title}> {centerText}</Text>
      {rightIcon ? rightIcon : placeholder}
    </View>
  );
};

const setInitalTime = () => {
  const currentTime = dateFns.startOfHour(new Date());
  const offsetTime = dateFns.getHours(dateFns.subHours(currentTime, 9));
  const initalTime = dateFns.subHours(currentTime, offsetTime);
  return initalTime;
};
//-------------------------------------------------------------------------------------------------------------------------------------------
export class FrequencySelector extends React.Component {
  state = {
    toggleTimer: {
      start: false,
      end: false
    }
  };

  getUserNotificationSettings = () => ({
    startTime: this.props.userData.startTime,
    endTime: this.props.userData.endTime,
    frequency: this.props.userData.frequency,
    subscriptionIsOn: true
  });

  toggleWatcher = (value = "start" | "end") => {
    if (value === "start") {
      this.setState({
        toggleTimer: { start: !this.state.toggleTimer.start, end: false }
      });
    }
    if (value === "end") {
      this.setState({
        toggleTimer: { end: !this.state.toggleTimer.end, start: false }
      });
    }
  };

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <TopNav
          leftIcon={
            <TouchableOpacity onPress={this.props.backToHome}>
              <Icon
                name="chevron-left"
                type="feather"
                color="#444444"
                size={30}
              />
            </TouchableOpacity>
          }
          centerText="Remind Me"
        />
        <View style={{ borderTopWidth: 1, borderTopColor: "#C4C4C4" }}>
          {this.props.frequencyOptions.map((option, key) => {
            return (
              <FrequencyOption
                key={key}
                label={option.label}
                value={option.value}
                onPress={() => {
                  this.props.setFrequency(option.value);
                }}
                selected={this.props.userData.frequency === option.value}
              />
            );
          })}
        </View>
        <View
          style={{
            height: 100,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={styles.subTitle}> From</Text>
        </View>
        <View
          style={{
            marginBottom: 60,
            borderBottomWidth: 1,
            borderBottomColor: "#C4C4C4"
          }}
        >
          <TimePeriod
            title="Start"
            time={dateFns.format(this.props.userData.startTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("start");
            }}
          />
          {this.state.toggleTimer.start && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.props.userData.startTime}
                onDateChange={this.props.setStartTime}
                mode="time"
                minuteInterval="10"
              />
              <TouchableOpacity
                style={styles.datePickerButton}
                activeOpacity={0.8}
                onPress={() => {
                  this.toggleWatcher("start");
                }}
              >
                <Text style={styles.datePickerButtonText}> Confirm </Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
          <TimePeriod
            title="End"
            time={dateFns.format(this.props.userData.endTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("end");
            }}
          />
          {this.state.toggleTimer.end && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.props.userData.endTime}
                onDateChange={this.props.setEndTime}
                mode="time"
                minuteInterval="10"
              />
              <TouchableOpacity
                style={styles.datePickerButton}
                activeOpacity={0.8}
                onPress={() => {
                  this.toggleWatcher("end");
                }}
              >
                <Text style={styles.datePickerButtonText}> Confirm </Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
        <PrimaryButton
          text={"Set Reminder"}
          onPress={() =>
            registerForPushNotificationsAsync(
              this.getUserNotificationSettings(),
              this.props.backToHome
            )
          }
        />
        <PrimaryButton text={"TestButton"} onPress={() => testFn()} />
      </ScrollView>
    );
  }
}
export class Home extends React.Component {
  stringifyFrequency = frequency => {
    if (frequency === 30) return "30 minutes";
    if (frequency === 60) return "hour";
    if (frequency === 120) return "2 hrs";
    if (frequency === 240) return "4 hrs";
  };
  showReminder = () => (
    <View style={{ flexGrow: 1, alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 30,
          textAlign: "center",
          fontSize: 16,
          color: "#444444"
        }}
      >
        Reminder set every{" "}
        <Text style={{ fontWeight: "600" }}>
          {this.stringifyFrequency(this.props.userData.frequency)}
        </Text>{" "}
        from{" "}
        <Text style={{ fontWeight: "600" }}>
          {dateFns.format(this.props.userData.startTime, "HH:mm")}
        </Text>{" "}
        to{" "}
        <Text style={{ fontWeight: "600" }}>
          {dateFns.format(this.props.userData.endTime, "HH:mm")}
        </Text>
      </Text>
      <Text
        style={styles.secondaryButtonStyle}
        onPress={this.props.setReminder}
      >
        Edit
      </Text>
    </View>
  );
  render() {
    return (
      <View style={styles.container}>
        <TopNav centerText="Daily Stoic" />
        <View
          style={{
            flexGrow: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("./assets/statue_head.png")}
            style={{ width: 279, height: 420 }}
          />
        </View>

        {this.props.userData ? (
          this.showReminder()
        ) : (
          <PrimaryButton
            text="Set Reminder"
            icon={
              <Icon
                name="chevron-right"
                type="feather"
                color="#444444"
                size={30}
              />
            }
            onPress={this.props.setReminder}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontFamily: "Cochin"
  },
  baseText: {
    color: "#555555"
  },
  title: {
    color: "#202020",
    fontSize: 37,
    fontWeight: "600"
  },
  subTitle: {
    color: "#202020",
    fontSize: 28,
    fontWeight: "500"
  },
  primaryButtonStyle: {
    backgroundColor: "#FFFFFF",
    height: 51,
    width: "70%",
    borderStyle: "solid",
    borderColor: "#444444",
    borderWidth: 1,
    color: "#444444",
    borderRadius: 3,
    alignItems: "center",
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  secondaryButtonStyle: {
    backgroundColor: "#F6F6F6",
    width: "70%",
    borderStyle: "solid",
    borderColor: "#444444",
    borderWidth: 1,
    color: "#444444",
    borderRadius: 3,
    fontSize: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  selectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    paddingHorizontal: 16
  },
  timeSelectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4",
    paddingHorizontal: 16
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    fontFamily: "Cochin",
    paddingBottom: 50
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4",
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4"
  },
  datePickerButtonText: {
    fontWeight: "600",
    color: "#444444"
  },
  datePickerStyle: {
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4"
  }
});
