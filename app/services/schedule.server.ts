import type { Activity, ActivityRegistration, Event } from "@prisma/client";
import { prisma } from "~/db.server";
import type { DayOfWeek } from "~/models/activity-dates";
import {
  activityTime,
  calculateActivityStartDateTime,
  getDayOfWeekForDate,
  parseDayOfWeek,
} from "~/models/activity-dates";

export type ScheduledActivity = {
  name: string;
  startTime: string;
  endTime?: string;
  type: "activity" | "registration-deadline";
};
export type EventSchedule = Record<DayOfWeek, ScheduledActivity[]>;

export async function getScheduleForEvent(
  eventId: string
): Promise<EventSchedule> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { startDate: true },
  });
  if (!event) {
    throw new Error("Could not find event with id " + eventId);
  }
  const eventActivities = await prisma.activity.findMany({
    where: { eventId },
    select: {
      name: true,
      activityType: true,
      dayOfWeek: true,
      durationMinutes: true,
      startTimeMinutesFromMidnight: true,
      Registration: {
        select: {
          deadlineMinutesBeforeStart: true,
        },
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTimeMinutesFromMidnight: "asc" }],
  });

  const schedule: EventSchedule = {
    friday: [],
    saturday: [],
    sunday: [],
  };

  for (const activity of eventActivities) {
    const registration = generateRegistrationDeadlineActivity(
      event,
      activity,
      activity.Registration
    );
    if (registration) {
      schedule[registration.dayOfWeek].push({
        name: activity.name,
        startTime: registration.startTime,
        type: "registration-deadline",
      });
    }

    const startTime = activityTime(activity.startTimeMinutesFromMidnight);
    const endTime = activity.durationMinutes
      ? activityTime(
          activity.startTimeMinutesFromMidnight + activity.durationMinutes
        )
      : undefined;
    const dayOfWeek = parseDayOfWeek(activity.dayOfWeek);
    schedule[dayOfWeek].push({
      name: activity.name,
      startTime,
      endTime,
      type: "activity",
    });
  }

  return schedule;
}

function generateRegistrationDeadlineActivity(
  event: Pick<Event, "startDate">,
  originalActivity: Pick<
    Activity,
    "startTimeMinutesFromMidnight" | "dayOfWeek"
  >,
  registration: Pick<ActivityRegistration, "deadlineMinutesBeforeStart"> | null
) {
  if (!registration) {
    return null;
  }

  const actualStartDateTime = calculateActivityStartDateTime(
    event,
    originalActivity
  );
  const startDateTime = new Date(
    actualStartDateTime.getTime() -
      registration.deadlineMinutesBeforeStart * 60 * 1000
  );
  const startTime = activityTime(
    startDateTime.getHours() * 60 + startDateTime.getMinutes()
  );

  const dayOfWeek = getDayOfWeekForDate(startDateTime);
  return {
    startTime,
    dayOfWeek,
  };
}
