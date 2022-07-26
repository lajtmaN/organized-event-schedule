import type { Activity, Event } from "@prisma/client";

export const DaysOfWeek = ["friday", "saturday", "sunday"] as const;
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

export const validateStartTime = (
  event: Pick<Event, "startDate">,
  activity: Pick<Activity, "dayOfWeek" | "startTimeMinutesFromMidnight">
) => {
  const calculatedStartTime = calculateActivityStartDateTime(event, activity);
  return calculatedStartTime != null;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const parseDayOfWeek = (type: string): DayOfWeek => {
  switch (type) {
    case "friday":
    case "saturday":
    case "sunday":
      return type;
    default:
      throw new Error(`Unknown day of week: ${type}`);
  }
};
