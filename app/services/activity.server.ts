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
  }
) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId },
    select: { startDate: true },
  });
  validateStartTime({ startDate: event.startDate }, activity);

  const fields = {
    eventId: eventId,
    activityType: activity.type,
    name: activity.name,
    dayOfWeek: activity.dayOfWeek,
    startTimeMinutesFromMidnight: activity.startTimeMinutesFromMidnight,
    durationMinutes: activity.durationMinutes,
  };

  return prisma.activity.upsert({
    where: { id: activity.id ?? "CREATE_NEW" },
    update: fields,
    create: fields,
  });
};

export const deleteActivity = async (activityId: string) => {
  return prisma.activity.delete({
    where: { id: activityId },
  });
};
