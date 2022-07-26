import { prisma } from "~/db.server";

export const eventExistsOrThrow = async (eventSlug: string | undefined) => {
  findEventOrThrow(eventSlug);
};

export const findEventOrThrow = async (eventSlug: string | undefined) => {
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }
  return prisma.event.findUniqueOrThrow({
    where: { slug: eventSlug },
    select: { id: true },
  });
};
