import type { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { DayOfWeek } from "~/models/activity-dates";
import { validateStartTime } from "~/models/activity-dates";
import type { ActivityType } from "~/models/activity-type";

export const upsertActivity = async (
  eventId: string,
  activity: {
    id?: string;
    type: ActivityType;
    name: string;
    dayOfWeek: DayOfWeek;
    startTimeMinutesFromMidnight: number;
    durationMinutes: number | null;
    registartionDeadlineMinutes: number | null;
    countdownMinutes: number | null;
  }
) => {
  const activityIdToSearchFor = activity.id ?? "CREATE_NEW"; // if no ID we will search for CREATE_NEW which will never exist and thus always do a create
  const [event, existingRegistration, existingCountdown] = await Promise.all([
    prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { startDate: true },
    }),
    prisma.activityRegistration.findUnique({
      where: { activityId: activityIdToSearchFor },
    }),
    prisma.activityCountdown.findUnique({
      where: { activityId: activityIdToSearchFor },
    }),
  ]);
  validateStartTime({ startDate: event.startDate }, activity);

  const fields = {
    eventId: eventId,
    activityType: activity.type,
    name: activity.name,
    dayOfWeek: activity.dayOfWeek,
    startTimeMinutesFromMidnight: activity.startTimeMinutesFromMidnight,
    durationMinutes: activity.durationMinutes,
  };
  const createFields: Prisma.ActivityUpsertArgs["create"] = {
    ...fields,
    Registration:
      activity.type === "tournament" && activity.registartionDeadlineMinutes
        ? {
            create: {
              deadlineMinutesBeforeStart: activity.registartionDeadlineMinutes,
            },
          }
        : undefined,
    Countdown: activity.countdownMinutes
      ? {
          create: {
            startCountdownMinutesBefore: activity.countdownMinutes,
          },
        }
      : undefined,
  };
  const updateFields: Prisma.ActivityUpsertArgs["update"] = {
    ...fields,
    Registration:
      activity.type === "tournament" && activity.registartionDeadlineMinutes
        ? {
            upsert: {
              create: {
                deadlineMinutesBeforeStart:
                  activity.registartionDeadlineMinutes!,
              },
              update: {
                deadlineMinutesBeforeStart:
                  activity.registartionDeadlineMinutes!,
              },
            },
          }
        : {
            delete: Boolean(existingRegistration),
          },
    Countdown: activity.countdownMinutes
      ? {
          upsert: {
            create: {
              startCountdownMinutesBefore: activity.countdownMinutes,
            },
            update: {
              startCountdownMinutesBefore: activity.countdownMinutes,
            },
          },
        }
      : {
          delete: Boolean(existingCountdown),
        },
  };

  return prisma.activity.upsert({
    where: { id: activityIdToSearchFor },
    create: createFields,
    update: updateFields,
  });
};

export const deleteActivity = async (activityId: string) => {
  return prisma.activity.delete({
    where: { id: activityId },
  });
};
