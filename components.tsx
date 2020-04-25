import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";

import { colors, spacing, fontSize } from "./theme";

const styles = StyleSheet.create({
  containerText: {
    color: colors.blue800
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: fontSize[1],
    backgroundColor: colors.white,
    height: spacing[7],
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    paddingHorizontal: spacing[3]
  },
  selectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: fontSize[1],
    backgroundColor: colors.white,
    height: spacing[7],
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    paddingHorizontal: spacing[3]
  },
  secondaryButton: {
    height: spacing[7],
    width: "auto",
    alignItems: "center",
    fontSize: fontSize[1],
    justifyContent: "space-between",
    flexDirection: "row"
  },
  primaryButton: {
    backgroundColor: colors.white,
    height: spacing[7],
    width: "70%",
    borderStyle: "solid",
    borderColor: colors.blue700,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    fontSize: fontSize[1],
    justifyContent: "space-between",
    flexDirection: "row"
  },
  primaryButtonText: {
    textAlign: "center",
    flexGrow: 1,
    color: colors.blue800
  },
  secondaryButtonText: {
    textAlign: "center",
    flexGrow: 1,
    color: colors.blue800,
    textDecorationLine: "underline"
  },
  focusedTabsContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    height: spacing[7],
    backgroundColor: colors.white,
    borderTopColor: colors.focused,
    borderTopWidth: 3
  },
  defaultTabsContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    height: spacing[7],
    backgroundColor: colors.white,
    borderTopColor: colors.blue200,
    borderTopWidth: 1
  },
  title: {
    color: colors.blue900,
    fontSize: fontSize[5]
  },
  titleSmall: {
    color: colors.blue900,
    fontSize: fontSize[3]
  },
  topNavigationContainer: {
    height: spacing[9],
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  bottomNavigation: {
    flexDirection: "row",
    alignItems: "center",
    width: "auto"
  },
  centerPlacement: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  oneThirdPlacement: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center"
  }
});

type FontWeightVariants = "SemiBold" | "Medium" | "Bold";

interface AppTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  fontWeight?: FontWeightVariants;
}
export const AppText = (props: AppTextProps) => {
  const fontType = !props.fontWeight ? "Regular" : props.fontWeight;
  return (
    <Text style={[{ fontFamily: `Montserrat-${fontType}` }, props.style]}>
      {props.children}
    </Text>
  );
};

export const Button = (props: {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}) => (
  <View>
    <TouchableOpacity
      style={styles[`${props.variant || "primary"}Button`]}
      onPress={props.onPress}
      activeOpacity={0.4}
    >
      <AppText
        fontWeight="Medium"
        style={styles[`${props.variant || "primary"}ButtonText`]}
      >
        {props.text}
      </AppText>
    </TouchableOpacity>
  </View>
);

interface BackgroundImageProps {
  opacity?: number;
  percentageOfScreenWidth?: number;
  placement?: "center" | "oneThird";
}
export const BackgroundImage = (props: BackgroundImageProps) => {
  const PERCENTAGE_OF_SCREEN_WIDTH = props.percentageOfScreenWidth || 0.7;
  const screenWidth = Math.round(Dimensions.get("window").width);
  const imgWidth = screenWidth * PERCENTAGE_OF_SCREEN_WIDTH;

  return (
    <View
      style={[
        styles[`${props.placement || "center"}Placement`],
        { opacity: props.opacity || 1 }
      ]}
    >
      <Image
        source={require("./assets/statue_head.png")}
        style={{ width: imgWidth, resizeMode: 'contain' }}
      />
    </View>
  );
};

interface TopNavigationProps {
  leftIcon?: React.ReactNode;
  centerText: string;
  rightIcon?: React.ReactNode;
  textSize?: "small" | "medium";
}
export const TopNavigation = (props: TopNavigationProps) => {
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

interface TextContainerProps {
  leftText: string;
  rightText: string;
  onPress: () => void;
}
export const TextContainer = (props: TextContainerProps) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={styles.textContainer}
    activeOpacity={1}
  >
    <AppText fontWeight="Medium" style={styles.containerText}>
      {props.leftText}
    </AppText>
    <AppText style={styles.containerText}>{props.rightText}</AppText>
  </TouchableOpacity>
);

interface SelectableContainerTextProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}
export const SelectableContainerText = (props: SelectableContainerTextProps) => (
  <TouchableOpacity style={styles.selectors} onPress={props.onPress}>
    <AppText style={styles.containerText}>{props.label}</AppText>
    {props.selected ? (
      <Icon name="check" type="feather" color={colors.blue800} size={15} />
    ) : null}
  </TouchableOpacity>
);

interface BottomNavigationProps {
  onPress: () => void;
  text?: string;
}
export const BottomNavigation = (props: BottomNavigationProps) => (
  <View>
    <TouchableOpacity
      onPress={ props.onPress}
      style={styles.bottomNavigation}
    >
      <Icon
        name="chevron-left"
        type="feather"
        color={colors.blue800}
        size={24}
      />
      <AppText
        fontWeight="SemiBold"
        style={{ fontSize: 18, color: colors.blue800 }}
        children={props.text || "Back"}
      />
    </TouchableOpacity>
  </View>
);

interface TabProps {
  topText: string;
  bottomText: string;
  onPress: () => void;
  variant: "focused" | "default";
}
export const Tab = (props: TabProps) => (
  <TouchableOpacity
    style={styles[`${props.variant || "default"}TabsContainer`]}
    onPress={() => props.onPress()}
  >
    <AppText
      fontWeight="Medium"
      style={{
        color: props.variant === "focused" ? colors.blue800 : colors.blue500
      }}
      children={props.topText}
    />
    <AppText
      fontWeight="Bold"
      style={{
        color: props.variant === "focused" ? colors.blue800 : colors.blue500
      }}
      children={props.bottomText}
    />
  </TouchableOpacity>
);