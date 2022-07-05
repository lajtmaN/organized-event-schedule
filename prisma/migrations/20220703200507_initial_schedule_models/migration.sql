-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTimeMinutesFromMidnight" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventId" TEXT,
    CONSTRAINT "Activity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityRegistration" (
    "activityId" TEXT NOT NULL PRIMARY KEY,
    "deadlineMinutesBeforeStart" INTEGER NOT NULL DEFAULT 10,
    CONSTRAINT "ActivityRegistration_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityAnnouncement" (
    "activityId" TEXT NOT NULL PRIMARY KEY,
    "announcedAt" DATETIME,
    "customMessage" TEXT,
    CONSTRAINT "ActivityAnnouncement_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityCountdown" (
    "activityId" TEXT NOT NULL PRIMARY KEY,
    "startCountdownMinutesBefore" INTEGER NOT NULL DEFAULT 10,
    CONSTRAINT "ActivityCountdown_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
