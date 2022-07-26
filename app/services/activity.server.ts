import { prisma } from "~/db.server";
import type { DayOfWeek } from "~/models/activity-dates";
import { validateStartTime } from "~/models/activity-dates";
import type { ActivityType } from "~/models/activity-type";

export const createActivity = async (
  eventId: string,
  activity: {
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
  return prisma.activity.create({
    data: {
      eventId: eventId,
      activityType: activity.type,
      name: activity.name,
      dayOfWeek: activity.dayOfWeek,
      startTimeMinutesFromMidnight: activity.startTimeMinutesFromMidnight,
      durationMinutes: activity.durationMinutes,
    },
  });
};
