import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { activityTime } from "~/models/activity-dates";
import { getNextActivityForCountdown } from "~/services/countdown.server";

export async function loader({ params }: LoaderArgs) {
  const activity = await getNextActivityForCountdown(params.eventId);

  if (!activity) {
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
