import { calculateActivityStartDateTime } from "./activity-dates";

const hours = (minutes: number): number => minutes * 60;

describe("calculateActivityStartDateTime", () => {
  it.each([
    [
      new Date(2022, 6, 8, 16),
      "friday",
      hours(16) + 30,
      new Date(2022, 6, 8, 16, 30),
    ],
    [new Date(2022, 6, 8, 16), "saturday", hours(10), new Date(2022, 6, 9, 10)],
    [new Date(2022, 6, 8, 16), "sunday", hours(10), new Date(2022, 6, 10, 10)],
    [
      new Date(2022, 6, 8, 16),
      "friday",
      hours(23) + 30,
      new Date(2022, 6, 8, 23, 30),
    ],
    [new Date(2022, 3, 29, 16), "sunday", hours(10), new Date(2022, 4, 1, 10)],
  ])(
    "should calculate activity start date based on relative activity date and event start time",
    (eventStartDate, actDayOfWeek, minutesFromMidnight, expectedStartDate) => {
      expect(
        calculateActivityStartDateTime(
          { startDate: eventStartDate },
          {
            dayOfWeek: actDayOfWeek,
            startTimeMinutesFromMidnight: minutesFromMidnight,
          }
        )
      ).toStrictEqual(expectedStartDate);
    }
  );

  it.each([
    [
      "Event start time is not a friday (thursday)",
      new Date(2022, 6, 7, 16),
      "friday",
      hours(16),
    ],
    [
      "Event start time is not a friday (saturday)",
      new Date(2022, 6, 9, 16),
      "friday",
      hours(16) + 30,
    ],
    [
      "Activity time cannot be more than 24 hours after midnight",
      new Date(2022, 6, 8, 16),
      "saturday",
      hours(25) + 30,
    ],
    [
      "Activity start time before event start time",
      new Date(2022, 6, 8, 16),
      "friday",
      hours(4) + 30,
    ],
    [
      "Activity start time before event start time",
      new Date(2022, 6, 8, 16),
      "friday",
      hours(4) + 30,
    ],
  ])(
    "should throw error because %s",
    (failReason, eventStartDate, actDayOfWeek, minutesFromMidnight) => {
      expect(() =>
        calculateActivityStartDateTime(
          { startDate: eventStartDate },
          {
            dayOfWeek: actDayOfWeek,
            startTimeMinutesFromMidnight: minutesFromMidnight,
          }
        )
      ).toThrowError();
    }
  );
});
