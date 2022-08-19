import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import {
  CreateUpdateActivityFields,
  CreateUpdateForm,
  extractActivityFromFormData,
} from "~/components/activities/create-update-form";
import { FormErrorMessage } from "~/components/form-error-message";
import { Heading } from "~/components/heading";
import { prisma } from "~/db.server";
import { activityTime, parseDayOfWeek } from "~/models/activity-dates";
import { parseActivityType } from "~/models/activity-type";
import { notFound } from "~/server/utils/notFound";
import { upsertActivity } from "~/services/activity.server";
import { eventExistsOrThrow, findEventOrThrow } from "~/services/event.server";

export async function loader({ request, params }: LoaderArgs) {
  await eventExistsOrThrow(params.slug);
  invariant(params.activityId, "activityId is required");

  const activity = await prisma.activity.findUnique({
    where: { id: params.activityId },
    select: {
      name: true,
      activityType: true,
      dayOfWeek: true,
      startTimeMinutesFromMidnight: true,
      durationMinutes: true,
      updatedAt: true,
      Registration: {
        select: {
          deadlineMinutesBeforeStart: true,
        },
      },
      Countdown: {
        select: {
          startCountdownMinutesBefore: true,
        },
      },
    },
  });
  if (!activity) {
    return notFound("Activity not found");
  }

  const url = new URL(request.url);
  const requestedAction =
    url.searchParams.get("action") === "duplicate"
      ? ("duplicate" as const)
      : ("update" as const);

  return json({
    defaultData: {
      name: activity.name,
      type: parseActivityType(activity.activityType),
      dayOfWeek: parseDayOfWeek(activity.dayOfWeek),
      startTime: activityTime(activity.startTimeMinutesFromMidnight),
      durationMinutes: activity.durationMinutes,
      registrationDeadline: activity.Registration?.deadlineMinutesBeforeStart,
      countdownMinutes: activity.Countdown?.startCountdownMinutesBefore,
    },
    lastUpdatedAt: activity.updatedAt,
    requestedAction,
  });
}
export async function action({ request, params }: ActionArgs) {
  const event = await findEventOrThrow(params.slug);
  invariant(params.activityId, "activityId is required");

  const formData = await request.formData();
  const requestedAction = formData.get("_action");
  invariant(
    requestedAction === "duplicate" || requestedAction === "update",
    "Requested action was not understood"
  );

  const { errors, activity } = extractActivityFromFormData(formData);
  if (errors.length > 0) {
    return json({
      errors,
      result: null,
    });
  }
  try {
    await upsertActivity(event.id, {
      id: requestedAction === "update" ? params.activityId : undefined,
      name: activity.name,
      type: activity.type,
      dayOfWeek: activity.dayOfWeek,
      startTimeMinutesFromMidnight: activity.minutesFromMidnight,
      durationMinutes: activity.duration,
      registartionDeadlineMinutes: activity.registrationDeadlineMinutes,
      countdownMinutes: activity.countdownMinutes,
    });

    return redirect(`/admin/event/${params.slug}`);
  } catch (e) {
    return json({
      errors: [
        {
          field: "activity",
          error: (e as Error)?.message ?? "Something went wrong...",
        },
      ],
      result: null,
    });
  }
}

export default function EditActivity() {
  const { t } = useTranslation();
  const transition = useTransition();
  const { defaultData, lastUpdatedAt, requestedAction } =
    useLoaderData<typeof loader>();
  const [type, setType] = useState(defaultData.type);

  const actionData = useActionData<typeof action>();
  const getErrorForField = (field: string) =>
    actionData?.errors?.find((err) => err.field === field)?.error;
  return (
    <div>
      <Heading>{t(`admin.event.activities.${requestedAction}.title`)}</Heading>
      <CreateUpdateForm>
        <CreateUpdateActivityFields.Name
          error={getErrorForField("name")}
          defaultValue={defaultData.name}
        />
        <CreateUpdateActivityFields.Type
          error={getErrorForField("type")}
          value={type}
          onChange={(evt) => setType(parseActivityType(evt.target.value))}
        />
        <CreateUpdateActivityFields.DayOfWeek
          error={getErrorForField("dayOfWeek")}
          defaultValue={defaultData.dayOfWeek}
        />
        <CreateUpdateActivityFields.StartTime
          error={getErrorForField("startTime")}
          defaultValue={defaultData.startTime}
        />
        <CreateUpdateActivityFields.DurationMinutes
          error={getErrorForField("durationMinutes")}
          defaultValue={defaultData.durationMinutes ?? undefined}
        />
        {type === "tournament" && (
          <CreateUpdateActivityFields.RegistrationDeadline
            error={getErrorForField("durationMinutes")}
            defaultValue={defaultData.registrationDeadline ?? undefined}
          />
        )}
        <CreateUpdateActivityFields.CountdownMinutes
          error={
            getErrorForField("countdownMinutes") ??
            (type === "mystery"
              ? t("activity.model.countdown.suggestedForMystery")
              : undefined)
          }
          defaultValue={defaultData.countdownMinutes}
        />
        <Button type="submit" value={requestedAction} name="_action">
          {transition?.state === "submitting"
            ? t(`admin.event.activities.${requestedAction}.submitting`)
            : t(`admin.event.activities.${requestedAction}.submit`)}
        </Button>
        {requestedAction === "update" && lastUpdatedAt ? (
          <em>
            Last updated at:{" "}
            <time dateTime={lastUpdatedAt}>
              {new Date(lastUpdatedAt).toLocaleString()}
            </time>
          </em>
        ) : null}
        <FormErrorMessage>{getErrorForField("activity")}</FormErrorMessage>
      </CreateUpdateForm>
    </div>
  );
}
