import { redirect } from "@remix-run/server-runtime";
import { notFound } from "~/server/utils/notFound";
import { latestPublishedEventSlug } from "~/services/event.server";

export async function loader() {
  // Retrieve the latest event slug and redirect to it.
  const latestEvent = await latestPublishedEventSlug();
  if (!latestEvent) {
    return notFound("No published events found");
  }
  return redirect(`/dashboard/${latestEvent.slug}`);
}
