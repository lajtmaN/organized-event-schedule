import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import {
  activityTime,
  calculateActivityStartDateTime,
} from "~/models/activity-dates";

export async function loader({ params }: LoaderArgs) {
  const activity = await prisma.activity.findFirst({
    where: {
      eventId: params.eventId,
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
    return json({ next: null });
  }
  // TODO make sure the countdown time uses the registration deadline if any
  // TODO make sure we don't show countdown for an activity that has already started
  const activityStartTime = calculateActivityStartDateTime(
    activity.Event,
    activity
  );
  const countdownStartTime =
    activityStartTime.getTime() -
    activity.Countdown.startCountdownMinutesBefore * 60 * 1000;

  if (countdownStartTime < Date.now()) {
    return json({ next: null });
  }
  return json({
    next: {
      activity: {
        name: activity.name,
        startTime: activityTime(activity.startTimeMinutesFromMidnight),
      },
      countdown: {
        endDateTime: new Date(new Date().setMinutes(-5)),
      },
    },
  });
}

export default function CountdownWidget() {
  const { next } = useLoaderData<typeof loader>();
  if (!next) {
    return null;
  }
  const { activity, countdown } = next;
  return (
    <div>
      Countdown to {activity.name}. Starts at: {activity.startTime}
      <p>{new Date(countdown.endDateTime).toLocaleString()}</p>
    </div>
  );
}
