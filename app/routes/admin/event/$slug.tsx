import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { StatusBadge } from "~/components/events/status-badge";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";
import { calculateEventStatus } from "~/services/event.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "slug is required");
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      published: true,
      startDate: true,
      endDate: true,
    },
  });
  if (!event) {
    return notFound("Event not found");
  }
  return json({
    event: {
      name: event.name,
      status: calculateEventStatus(event),
    },
  });
}

export default function EventSlugBaseRoute() {
  const { event } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageHeaderTitle>
        <span className="flex items-center gap-2">
          {event.name}
          <StatusBadge status={event.status} badge={{ size: "sm" }} />
        </span>
      </PageHeaderTitle>
      <PageBody>
        <Outlet />
      </PageBody>
    </div>
  );
}
