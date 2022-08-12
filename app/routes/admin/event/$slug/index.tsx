import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { ErrorAlert } from "~/components/error-alert";
import {
  Link,
  MinimalisticLink,
  MinimalisticLinkStyling,
} from "~/components/link";
import { prisma } from "~/db.server";
import { activityTime, parseDayOfWeek } from "~/models/activity-dates";
import { parseActivityType } from "~/models/activity-type";
import { notFound } from "~/server/utils/notFound";
import { DeleteActivityButton } from "./activities/$activityId.delete";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "slug is required");
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      activities: {
        select: {
          id: true,
          name: true,
          activityType: true,
          startTimeMinutesFromMidnight: true,
          dayOfWeek: true,
          Announcement: true,
          Countdown: true,
          Registration: true,
        },
        orderBy: [
          {
            dayOfWeek: "asc",
          },
          {
            startTimeMinutesFromMidnight: "asc",
          },
        ],
      },
    },
  });
  if (!event) {
    return notFound("Event not found");
  }

  return json({
    activities: event.activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      type: parseActivityType(activity.activityType),
      dayOfWeek: parseDayOfWeek(activity.dayOfWeek),
      startTime: activityTime(activity.startTimeMinutesFromMidnight),
      announcement: Boolean(activity.Announcement),
      countdown: Boolean(activity.Countdown),
      registration: Boolean(activity.Registration),
    })),
  });
};

export default function Event() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { activities } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-xl font-bold text-gray-900">
          {t("admin.event.activities.table.header")}
        </h2>
        <div>
          <Link to="activities/new">
            {t("admin.event.activities.table.createActivity")}
          </Link>
        </div>
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>{t("activity.model.name")}</Table.HeadCell>
          <Table.HeadCell>{t("activity.model.type")}</Table.HeadCell>
          <Table.HeadCell>{t("activity.model.dayOfWeek")}</Table.HeadCell>
          <Table.HeadCell>{t("activity.model.time")}</Table.HeadCell>
          <Table.HeadCell>
            {t("admin.event.activities.table.actions")}
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {activities.map((activity) => (
            <Table.Row key={activity.id}>
              <Table.Cell>{activity.name}</Table.Cell>
              <Table.Cell>
                {t(`activity.model.type.${activity.type}`)}
              </Table.Cell>
              <Table.Cell className="capitalize">
                {t(`activity.model.dayOfWeek.${activity.dayOfWeek}`)}
              </Table.Cell>
              <Table.Cell>{activity.startTime}</Table.Cell>
              <Table.Cell className="space-x-2">
                <MinimalisticLink to={`activities/${activity.id}`}>
                  {t("admin.event.activities.table.updateActivity")}
                </MinimalisticLink>
                <MinimalisticLink
                  to={`activities/${activity.id}?action=duplicate`}
                >
                  {t("admin.event.activities.table.duplicateActivity")}
                </MinimalisticLink>
                <DeleteActivityButton
                  className={MinimalisticLinkStyling}
                  activityId={activity.id}
                >
                  {t("admin.event.activities.delete")}
                </DeleteActivityButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <h2 className="text-xl font-bold text-gray-900">Shortcuts</h2>
      <ul>
        <li>
          <MinimalisticLink to={`/schedule/${slug}`}>Tidsplan</MinimalisticLink>
        </li>
        <li>Link til dashboard</li>
      </ul>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <ErrorAlert>An unexpected error occurred: {error.message}</ErrorAlert>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <ErrorAlert>{caught.data}</ErrorAlert>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
