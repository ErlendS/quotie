export type ScreensT = "home" | "setReminder" | "setBetween" | "setFrequency";
export type SetScreenFn = React.Dispatch<React.SetStateAction<ScreensT>>;
export interface UserSettingsT {
  startTime: Date;
  endTime: Date;
  frequency: number;
  subscriptionIsOn: boolean;
}
