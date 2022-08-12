import type { Event } from "@prisma/client";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";

export const eventExistsOrThrow = async (eventSlug: string | undefined) => {
  await findEventOrThrow(eventSlug);
};

export const findEventOrThrow = async (eventSlug: string | undefined) => {
  if (!eventSlug) {
    return notFound(`Event slug is required`);
  }

  const event = await prisma.event.findUnique({
    where: { slug: eventSlug },
    select: { id: true },
  });
  if (!event) {
    return notFound(`Event with slug ${eventSlug} not found`);
  }
  return event;
};

export const isEventCurrentlyRunning = (
  event: Pick<Event, "startDate" | "endDate">
) => {
  const now = new Date();
  return now >= event.startDate && now <= event.endDate;
};

export type EventStatus = "draft" | "live" | "past" | "future";
export const calculateEventStatus = (
  event: Pick<Event, "startDate" | "endDate" | "published">
): EventStatus => {
  if (!event.published) {
    return "draft";
  }
  if (isEventCurrentlyRunning(event)) {
    return "live";
  }
  if (event.endDate < new Date()) {
    return "past";
  }
  return "future";
};
