import { prisma } from "~/db.server";

export const eventExistsOrThrow = async (eventSlug: string | undefined) => {
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }
  await prisma.event.findUniqueOrThrow({
    where: { slug: eventSlug },
    select: { id: true },
  });
};
