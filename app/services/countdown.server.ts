import { prisma } from "~/db.server";
import { calculateActivityStartDateTime } from "~/models/activity-dates";

export const getNextActivityForCountdown = async (
  eventId: string | undefined
) => {
  const activity = await prisma.activity.findFirst({
    where: {
      eventId,
      Countdown: {
        startCountdownMinutesBefore: {
          gt: 0,
        },
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTimeMinutesFromMidnight: "asc" }],
    select: {
      name: true,
      dayOfWeek: true,
      startTimeMinutesFromMidnight: true,
      Registration: {
        select: {
          deadlineMinutesBeforeStart: true,
        },
      },
      Countdown: {
        select: {
          startCountdownMinutesBefore: true,
        },
      },
      Event: {
        select: {
          startDate: true,
        },
      },
    },
  });

  if (!activity?.Countdown?.startCountdownMinutesBefore) {
    return null;
  }
  const activityStartDateTime = calculateActivityStartDateTime(
    activity.Event,
    activity
  );
  const activityAlreadyStarted = activityStartDateTime.getTime() < Date.now();
  if (activityAlreadyStarted) {
    return null;
  }

  const countdownStartTime =
    activityStartDateTime.getTime() -
    activity.Countdown.startCountdownMinutesBefore * 60 * 1000;

  const isCountdownStarted = countdownStartTime > Date.now();
  if (!isCountdownStarted) {
    return null;
  }

  // TODO make sure the countdown time uses the registration deadline if any
  // TODO add lots of tests
  return activity;
};

/** Returns true if date1 is later than date2 */
const isLaterThan = (date1: Date, date2: Date) => {
  return date1.getTime() > date2.getTime();
};
