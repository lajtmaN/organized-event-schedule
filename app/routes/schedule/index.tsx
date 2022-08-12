import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";

export async function loader() {
  // Retrieve the latest event slug and redirect to it.
  const latestEvent = await prisma.event.findFirst({
    where: {
      published: true,
    },
    orderBy: {
      startDate: "desc",
    },
    select: {
      slug: true,
    },
  });
  if (!latestEvent) {
    return notFound("No published events found");
  }
  return redirect(`/schedule/${latestEvent.slug}`);
}
