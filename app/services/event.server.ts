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
