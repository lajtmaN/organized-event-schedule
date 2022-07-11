import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { ErrorAlert } from "~/components/error-alert";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";
import type { DayOfWeek } from "~/models/activity-dates";
import { calculateActivityStartDateTime } from "~/models/activity-dates";
import type { ActivityType } from "~/models/activity-type";
import { parseActivityType } from "~/models/activity-type";

type Activity = {
  id: string;
  type: ActivityType;
  name: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  registration: boolean;
  announcement: boolean;
  countdown: boolean;
};
type LoaderData = {
  event?: {
    id: string;
    name: string;
    activities: Activity[];
  };
  error?: {
    message: string;
  };
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.slug;
  invariant(slug, "slug is required");
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return json<LoaderData>(
      { error: { message: "Event not found" } },
      { status: 404 }
    );
  }
  const activities = await prisma.activity.findMany({
    where: { eventId: event.id },
    include: {
      Announcement: true,
      Countdown: true,
      Registration: true,
    },
  });
  return json<LoaderData>({
    event: {
      id: event.id,
      name: event.name,
      activities: activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        type: parseActivityType(activity.activityType),
        dayOfWeek: activity.dayOfWeek,
        startTime: calculateActivityStartDateTime(
          { startDate: event.startDate },
          activity
        ),
        announcement: Boolean(activity.Announcement),
        countdown: Boolean(activity.Countdown),
        registration: Boolean(activity.Registration),
      })),
    },
  });
};

export default function Event() {
  const { t } = useTranslation();
  const { event, error } = useLoaderData<LoaderData>();
  if (error || !event) {
    return <ErrorAlert>{error?.message}</ErrorAlert>;
  }
  return (
    <div>
      <PageHeaderTitle>{event.name}</PageHeaderTitle>
      <PageBody>
        <h2 className="text-xl font-bold text-gray-900">
          {t("admin.event.activities.table.header")}
        </h2>
        <Table striped>
          <Table.Head>
            <Table.HeadCell>{t("activity.model.name")}</Table.HeadCell>
            <Table.HeadCell>{t("activity.model.type")}</Table.HeadCell>
            <Table.HeadCell>{t("activity.model.dayOfWeek")}</Table.HeadCell>
            <Table.HeadCell>{t("activity.model.time")}</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {event.activities.map((activity) => (
              <Table.Row key={activity.id}>
                <Table.Cell>{activity.name}</Table.Cell>
                <Table.Cell>{activity.type}</Table.Cell>
                <Table.Cell className="capitalize">
                  {activity.dayOfWeek}
                </Table.Cell>
                <Table.Cell>
                  {new Date(activity.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <ul>
          <li>TODO:</li>
          <li>Opret ny aktivitet</li>
          <li>Links til tidsplan og dashboard</li>
        </ul>
      </PageBody>
    </div>
  );
}
