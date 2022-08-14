import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Card, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { ErrorAlert } from "~/components/error-alert";
import { Heading } from "~/components/heading";
import {
  DangerMinimalisticLinkStyling,
  Link,
  MinimalisticLink,
  MinimalisticLinkStyling,
} from "~/components/link";
import { prisma } from "~/db.server";
import { activityTime, parseDayOfWeek } from "~/models/activity-dates";
import { parseActivityType } from "~/models/activity-type";
import { notFound } from "~/server/utils/notFound";
import { DeleteActivityButton } from "./activities/$activityId.delete";
import { DeleteEventButton } from "./delete";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "slug is required");
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      startDate: true,
      endDate: true,

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
    event: { startDate: event.startDate, endDate: event.endDate },
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
  const { event, activities } = useLoaderData<typeof loader>();
  if (!slug) {
    return <div>Slug is required</div>;
  }

  return (
    <div className="space-y-3">
      <Heading>{t("admin.event.details.title")}</Heading>
      <Card>
        <div className="flex flex-row justify-between">
          <ul className="list-inside list-disc">
            <li className="">
              {t("event.model.startDate")}:{" "}
              {new Date(event.startDate).toLocaleString()}
            </li>
            <li>
              {t("event.model.endDate")}:{" "}
              {new Date(event.endDate).toLocaleString()}
            </li>
            <li>
              <MinimalisticLink to="edit">
                {t("admin.event.details.edit")}
              </MinimalisticLink>
            </li>
          </ul>
          <DeleteEventButton
            slug={slug}
            className={DangerMinimalisticLinkStyling}
          >
            {t("admin.event.details.delete")}
          </DeleteEventButton>
        </div>
      </Card>
      <div className="flex flex-row items-center justify-between pt-2">
        <Heading>{t("admin.event.activities.table.header")}</Heading>
        <div>
          <Link to="activities/new">
            {t("admin.event.activities.table.createActivity")}
          </Link>
        </div>
      </div>
      <Table striped className="border">
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
          {activities.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5}>
                {t("admin.event.activities.table.noResults")}
                <br />
                <MinimalisticLink to="activities/seed">
                  {t("admin.event.activities.table.copyActivities")}
                </MinimalisticLink>
              </Table.Cell>
            </Table.Row>
          ) : (
            activities.map((activity) => (
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
            ))
          )}
        </Table.Body>
      </Table>
      <Heading>Shortcuts</Heading>
      <ul>
        <li>
          <MinimalisticLink to={`/schedule/${slug}`}>Tidsplan</MinimalisticLink>
        </li>
        <li>Link til dashboard</li>
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
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
