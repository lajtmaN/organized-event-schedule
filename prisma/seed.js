const { PrismaClient } = require("@prisma/client");
const slug = require("slug");

const prisma = new PrismaClient();

async function seed() {
  const event = await prisma.event.create({
    data: {
      name: "NNP Sommer",
      slug: slug("NNP Sommer"),
      startDate: new Date(2022, 6, 17, 14, 0),
      endDate: new Date(2022, 6, 19, 12, 0),
    },
  });

  await prisma.activity.create({
    data: {
      eventId: event.id,
      dayOfWeek: "friday",
      startTimeMinutesFromMidnight: 16 * 60,
      activityType: "other",
      name: "Doors open",
      Countdown: {
        create: {
          startCountdownMinutesBefore: 3 * 60,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
