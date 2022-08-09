import { useActionData, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button, Checkbox, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";
import {
  CreateUpdateActivityFields,
  CreateUpdateForm,
  extractActivityFromFormData,
} from "~/components/activities/CreateUpdateForm";
import { FormErrorMessage } from "~/components/form-error-message";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { upsertActivity } from "~/services/activity.server";
import { eventExistsOrThrow, findEventOrThrow } from "~/services/event.server";

export const loader = async ({ params, request }: LoaderArgs) => {
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
  const transition = useTransition();

  const actionData = useActionData<typeof action>();

  const previouslyCreatedActivity = actionData?.result?.name;

  const getErrorForField = (field: string) =>
    actionData?.errors?.find((err) => err.field === field)?.error;
  return (
    <div>
      <PageHeaderTitle>
        {t("admin.event.activities.create.title")}
      </PageHeaderTitle>
      <PageBody>
        <CreateUpdateForm>
          <CreateUpdateActivityFields.Name error={getErrorForField("name")} />
          <CreateUpdateActivityFields.Type error={getErrorForField("type")} />
          <CreateUpdateActivityFields.DayOfWeek
            error={getErrorForField("dayOfWeek")}
          />
          <CreateUpdateActivityFields.StartTime
            error={getErrorForField("startTime")}
          />
          <CreateUpdateActivityFields.DurationMinutes
            error={getErrorForField("durationMinutes")}
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
      </PageBody>
    </div>
  );
}
