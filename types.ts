export type ScreensT = "home" | "setReminder";
export type SetScreenFn = React.Dispatch<React.SetStateAction<ScreensT>>;
export interface UserDataT {
  startTime: Date;
  endTime: Date;
  frequency: number;
}
