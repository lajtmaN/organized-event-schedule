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
  }
) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    select: { startDate: true },
  });
  validateStartTime({ startDate: event.startDate }, activity);

  const activityIdToSearchFor = activity.id ?? "CREATE_NEW"; // if no ID we will search for CREATE_NEW which will never exist and thus always do a create
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
    Registration: activity.registartionDeadlineMinutes
      ? {
          create: {
            deadlineMinutesBeforeStart: activity.registartionDeadlineMinutes!,
          },
        }
      : undefined,
  };
  const updateFields: Prisma.ActivityUpsertArgs["update"] = {
    ...fields,
    Registration: activity.registartionDeadlineMinutes
      ? {
          upsert: {
            create: {
              deadlineMinutesBeforeStart: activity.registartionDeadlineMinutes!,
            },
            update: {
              deadlineMinutesBeforeStart: activity.registartionDeadlineMinutes!,
            },
          },
        }
      : {
          delete: true,
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
