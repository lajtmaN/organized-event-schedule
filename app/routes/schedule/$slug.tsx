import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";
import type { ScheduledActivity } from "~/services/schedule.server";
import { getScheduleForEvent } from "~/services/schedule.server";
import { keys } from "~/utils";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "slug is required");

  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, slug: true },
  });
  if (!event) {
    return notFound("Event not found");
  }

  const schedule = await getScheduleForEvent(event.id);

  return json({
    event,
    schedule,
  });
}
export default function ScheduleRoute() {
  const { t } = useTranslation();
  const { schedule, event } = useLoaderData<typeof loader>();

  return (
    <div>
      <PageHeaderTitle>
        {t("schedule.title", { eventName: event.name })}
      </PageHeaderTitle>
      <PageBody>
        {keys(schedule).map((day) => (
          <div key={day} className="flex border-b-2 last-of-type:border-b-0">
            <h1 className="w-1/6 min-w-[100px] font-bold">
              {t(`activity.model.dayOfWeek.${day}`)}
            </h1>
            <div>
              {schedule[day].map((act) => (
                <ActivityRow key={act.name + act.startTime} activity={act} />
              ))}
            </div>
          </div>
        ))}
      </PageBody>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ScheduledActivity }) {
  const { t } = useTranslation();
  const name =
    activity.type === "registration-deadline"
      ? t("schedule.activity.registration.deadlineText", {
          activityName: activity.name,
        })
      : activity.name;
  return (
    <div>
      <span className="mr-1 inline-block w-28">
        {activity.startTime}
        {activity.endTime ? ` - ${activity.endTime}` : ""}:
      </span>
      <span>{name}</span>
    </div>
  );
}
