export type ScreensT = "home" | "setReminder" | "setBetween" | "setFrequency";
export type SetScreenFn = React.Dispatch<React.SetStateAction<ScreensT>>;
export interface UserDataT {
  startTime: Date;
  endTime: Date;
  frequency: number;
  subscriptionIsOn: boolean;
}
