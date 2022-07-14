import { ChevronRightIcon } from "@heroicons/react/outline";
import type { Event } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";

type LoaderData = {
  events: Event[];
};
export const loader: LoaderFunction = async () => {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "desc",
    },
  });
  return json<LoaderData>({ events });
};

export default function Index() {
  const { t } = useTranslation();
  const { events } = useLoaderData<LoaderData>();
  return (
    <div>
      <PageHeaderTitle>{t("admin.events.title")}</PageHeaderTitle>
      <PageBody>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                  <Table.Cell>{/* Upcomming/Current/Past */}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/event/${event.slug}`} prefetch="intent">
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
