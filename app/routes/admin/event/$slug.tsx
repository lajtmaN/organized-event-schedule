import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "slug is required");
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
    },
  });
  if (!event) {
    return notFound("Event not found");
  }
  return json({ event });
}

export default function EventSlugBaseRoute() {
  const { event } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageHeaderTitle>{event.name}</PageHeaderTitle>
      <PageBody>
        <Outlet />
      </PageBody>
    </div>
  );
}
