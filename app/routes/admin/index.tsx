import { ChevronRightIcon } from "@heroicons/react/outline";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { Button, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "~/components/events/status-badge";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";
import { calculateEventStatus } from "~/services/event.server";

export const loader = async () => {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "desc",
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      slug: true,
      published: true,
    },
  });

  const mapped = events.map(({ published, ...event }) => ({
    ...event,
    status: calculateEventStatus({
      published,
      startDate: event.startDate,
      endDate: event.endDate,
    }),
  }));
  return json({ events: mapped });
};

export default function Index() {
  const { t } = useTranslation();
  const { events } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageHeaderTitle>{t("admin.events.title")}</PageHeaderTitle>
      <PageBody>
        <div className="relative overflow-x-auto border shadow-md sm:rounded-lg">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>{t("event.model.name")}</Table.HeadCell>
              <Table.HeadCell>{t("event.model.startDate")}</Table.HeadCell>
              <Table.HeadCell>{t("event.model.endDate")}</Table.HeadCell>
              <Table.HeadCell>{t("event.model.status")}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {events.map((event) => (
                <Table.Row key={event.id}>
                  <Table.Cell>{event.name}</Table.Cell>
                  <Table.Cell>
                    {new Date(event.startDate).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(event.endDate).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={event.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`event/${event.slug}`} prefetch="intent">
                      <Button>
                        {t("admin.events.table.edit")}
                        <ChevronRightIcon className="ml-2 h-4" />
                      </Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </PageBody>
    </div>
  );
}
