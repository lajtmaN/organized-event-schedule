import { useActionData, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button, Checkbox, Label } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CreateUpdateActivityFields,
  CreateUpdateForm,
  extractActivityFromFormData,
} from "~/components/activities/create-update-form";
import { FormErrorMessage } from "~/components/form-error-message";
import { Heading } from "~/components/heading";
import type { ActivityType } from "~/models/activity-type";
import { parseActivityType } from "~/models/activity-type";
import { upsertActivity } from "~/services/activity.server";
import { eventExistsOrThrow, findEventOrThrow } from "~/services/event.server";

export const loader = async ({ params }: LoaderArgs) => {
  await eventExistsOrThrow(params.slug);
  return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const event = await findEventOrThrow(params.slug);

  const formData = await request.formData();
  const { errors, activity } = extractActivityFromFormData(formData);

  if (errors.length > 0) {
    return json({
      errors,
      result: null,
    });
  }
  try {
    await upsertActivity(event.id, {
      name: activity.name!,
      type: activity.type,
      dayOfWeek: activity.dayOfWeek,
      startTimeMinutesFromMidnight: activity.minutesFromMidnight,
      durationMinutes: activity.duration,
      registartionDeadlineMinutes: activity.registrationDeadlineMinutes,
      countdownMinutes: activity.countdownMinutes,
    });
    if (formData.get("create-another")) {
      return json({ result: { name: activity.name! }, errors: null });
    }
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
};

export default function CreateActivity() {
  const { t } = useTranslation();
  const [type, setType] = useState<ActivityType>("tournament");

  const transition = useTransition();
  const actionData = useActionData<typeof action>();

  const previouslyCreatedActivity = actionData?.result?.name;

  const getErrorForField = (field: string) =>
    actionData?.errors?.find((err) => err.field === field)?.error;
  return (
    <div>
      <Heading>{t("admin.event.activities.create.title")}</Heading>
      <CreateUpdateForm>
        <CreateUpdateActivityFields.Name error={getErrorForField("name")} />
        <CreateUpdateActivityFields.Type
          error={getErrorForField("type")}
          value={type}
          onChange={(evt) => setType(parseActivityType(evt.target.value))}
        />
        <CreateUpdateActivityFields.DayOfWeek
          error={getErrorForField("dayOfWeek")}
        />
        <CreateUpdateActivityFields.StartTime
          error={getErrorForField("startTime")}
        />
        <CreateUpdateActivityFields.DurationMinutes
          error={getErrorForField("durationMinutes")}
        />
        {type === "tournament" && (
          <CreateUpdateActivityFields.RegistrationDeadline
            error={getErrorForField("durationMinutes")}
          />
        )}
        <CreateUpdateActivityFields.CountdownMinutes
          error={getErrorForField("registrationDeadline")}
        />

        <div className="flex flex-row items-center gap-4">
          <Button type="submit">
            {transition?.state === "submitting"
              ? t("admin.event.activities.create.submitting")
              : t("admin.event.activities.create.submit")}
          </Button>
          <Label>
            <div className="flex items-center space-x-2">
              <Checkbox name="create-another" />
              <span>{t("admin.event.activities.create.createMore")}</span>
            </div>
          </Label>
        </div>
        <FormErrorMessage>{getErrorForField("activity")}</FormErrorMessage>

        {previouslyCreatedActivity ? (
          <em>{previouslyCreatedActivity} was created...</em>
        ) : null}
      </CreateUpdateForm>
    </div>
  );
}
