import type { DayOfWeek } from "~/models/activity-dates";
import type { ActivityType } from "~/models/activity-type";

export const createActivity = (activity: {
  type: ActivityType;
  name: string;
  dayOfWeek: DayOfWeek;
  startTimeMinutesFromMidnight: number;
  durationMinutes: number | null;
}) => {
  console.log(activity);
};
