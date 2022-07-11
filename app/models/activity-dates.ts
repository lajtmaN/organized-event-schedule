import type { Activity, Event } from "@prisma/client";

export const DaysOfWeek = ["friday", "saturday", "sunday"];
export type DayOfWeek = typeof DaysOfWeek[number];

export const calculateActivityStartDateTime = (
  event: Pick<Event, "startDate">,
  activity: Pick<Activity, "dayOfWeek" | "startTimeMinutesFromMidnight">
): Date => {
  if (event.startDate.getDay() !== 5) {
    throw new Error("Event start date is not a friday");
  }
  const dayIndex = DaysOfWeek.findIndex((day) => day === activity.dayOfWeek);
  const activityStartTime = addDays(event.startDate, dayIndex);

  const hours = activity.startTimeMinutesFromMidnight / 60;
  if (hours >= 24) {
    throw new Error("Activity start time is after midnight - change day");
  }
  const minutes = activity.startTimeMinutesFromMidnight % 60;
  activityStartTime.setHours(hours, minutes, 0, 0);

  if (activityStartTime < event.startDate) {
    throw new Error("Activity start time is before event start time");
  }
  return activityStartTime;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
