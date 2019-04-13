import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DatePickerIOS
} from "react-native";
import { Permissions, Notifications } from "expo";

import { Icon } from "react-native-elements";
import * as dateFns from "date-fns";

const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.

  // ADD FIREBASE ENDPOINT, SET UP BODY WITH CORRECT DATA
  return fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: {
        value: token
      },
      user: {
        username: "Brent"
      }
    })
  });
}
export default class App extends React.Component {
  state = {
    screen: "home",
    cycle: {
      start: "09:00",
      end: "22:00"
    },
    frequency: 1
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

  onSetCycle = (start, end) => {
    this.setState({
      cycle: {
        start,
        end
      }
    });
  };
  onSetFrequency = value => {
    this.setState({
      frequency: value
    });
  };

  render() {
    return this.state.screen === "home" ? (
      <Home setReminder={this.goToSetReminder} />
    ) : (
      <FrequencySelector
        setFrequency={this.onSetFrequency}
        frequency={this.state.frequency}
        backToHome={this.onBackToHome}
      />
    );
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
      style={styles.buttonStyle}
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

export class FrequencySelector extends React.Component {
  state = {
    startTime: this.props.initalStartTime || setInitalTime(),
    endTime: this.props.initalEndTime || dateFns.addHours(setInitalTime(), 12),
    toggleTimer: {
      start: false,
      end: false
    }
  };

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
  setStartTime = newTime => this.setState({ startTime: newTime });
  setEndTime = newTime => this.setState({ endTime: newTime });
  options = [
    {
      label: "Every 30 min",
      value: 0
    },
    {
      label: "Every hour",
      value: 1
    },
    {
      label: "Every 2 hrs",
      value: 2
    },
    {
      label: "Every 4 hrs",
      value: 3
    }
    // {
    //   label: "Every 6 hrs",
    //   value: 4
    // }
  ];
  render() {
    return (
      <View style={styles.wrapper}>
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
          {this.options.map((option, key) => {
            return (
              <FrequencyOption
                key={key}
                label={option.label}
                value={option.value}
                onPress={() => {
                  this.props.setFrequency(option.value);
                }}
                selected={this.props.frequency === option.value}
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
            time={dateFns.format(this.state.startTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("start");
            }}
          />
          {this.state.toggleTimer.start && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.state.startTime}
                onDateChange={this.setStartTime}
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
            time={dateFns.format(this.state.endTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("end");
            }}
          />
          {this.state.toggleTimer.end && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.state.endTime}
                onDateChange={this.setEndTime}
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
          onPress={() => registerForPushNotificationsAsync()}
        />
      </View>
    );
  }
}
export class Home extends React.Component {
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
  buttonStyle: {
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
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4"
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
