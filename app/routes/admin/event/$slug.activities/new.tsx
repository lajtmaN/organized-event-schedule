import { Form, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FormErrorMessage } from "~/components/form-error-message";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { RequiredMark } from "~/components/required-mark";
import { DaysOfWeek, parseDayOfWeek } from "~/models/activity-dates";
import { ActivityTypes, parseActivityType } from "~/models/activity-type";
import { createActivity } from "~/services/activity.server";
import { eventExistsOrThrow, findEventOrThrow } from "~/services/event.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await eventExistsOrThrow(params.slug);
  return null;
};

interface ActionData {
  result: { name: string } | null;
  errors?: Array<{ field: string; error: string }>;
}
export const action: ActionFunction = async ({ request, params }) => {
  const event = await findEventOrThrow(params.slug);

  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const type = parseActivityType(formData.get("type")?.toString() ?? "");
  const dayOfWeek = parseDayOfWeek(formData.get("dayOfWeek")?.toString() ?? "");
  const startTimeRaw = formData.get("startTime");
  const minutesFromMidnight = getMinutesFromMidnight(startTimeRaw);
  const durationRaw = formData.get("durationMinutes");
  const duration = durationRaw ? parseInt(durationRaw.toString()) : null;

  const errors: ActionData["errors"] = [];
  if (!name) errors.push({ field: "name", error: "Name is required" });
  if (!type) errors.push({ field: "type", error: "Type is required" });
  if (!dayOfWeek)
    errors.push({ field: "dayOfWeek", error: "Day of week is required" });
  if (minutesFromMidnight == null)
    errors.push({ field: "startTime", error: "Start time is required" });

  if (errors.length > 0) {
    return json<ActionData>({
      errors,
      result: null,
    });
  }
  try {
    await createActivity(event.id, {
      name: name!,
      type,
      dayOfWeek,
      startTimeMinutesFromMidnight: minutesFromMidnight!,
      durationMinutes: duration,
    });
    if (formData.get("create-another")) {
      return json<ActionData>({ result: { name: name! } });
    }
    return redirect(`/admin/event/${params.slug}`);
  } catch (e) {
    return json<ActionData>({
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

  const actionData = useActionData<ActionData>();

  const previouslyCreatedActivity = actionData?.result?.name;

  const getErrorForField = (field: string) =>
    actionData?.errors?.find((err) => err.field === field)?.error;
  return (
    <div>
      <PageHeaderTitle>
        {t("admin.event.activities.create.title")}
      </PageHeaderTitle>
      <PageBody>
        <Form
          method="post"
          className="flex flex-col gap-4 rounded-md p-5 shadow-md"
        >
          <Label>
            <span>
              {t("activity.model.name")}
              <RequiredMark />
            </span>
            <TextInput name="name" required />
            <FormErrorMessage>{getErrorForField("name")}</FormErrorMessage>
          </Label>
          <Label>
            <span>
              {t("activity.model.type")}
              <RequiredMark />
            </span>
            <Select name="type" required>
              {ActivityTypes.map((type) => (
                <option value={type} key={type}>
                  {t(`activity.model.type.${type}`)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{getErrorForField("type")}</FormErrorMessage>
          </Label>
          <Label>
            <span>
              {t("activity.model.dayOfWeek")}
              <RequiredMark />
            </span>
            <Select name="dayOfWeek" required>
              {DaysOfWeek.map((dayOfWeek) => (
                <option value={dayOfWeek} key={dayOfWeek}>
                  {t(`activity.model.dayOfWeek.${dayOfWeek}`)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{getErrorForField("dayOfWeek")}</FormErrorMessage>
          </Label>
          <Label>
            <span>
              {t("activity.model.time")}
              <RequiredMark />
            </span>
            {/* TODO: Set min and max */}
            <TextInput
              type="time"
              name="startTime"
              required
              helperText={t("activity.model.time.helpText")}
            />
            <FormErrorMessage>{getErrorForField("startTime")}</FormErrorMessage>
          </Label>
          <Label>
            <span>{t("activity.model.durationMinutes")}</span>
            <TextInput
              type="number"
              name="durationMinutes"
              helperText={t("activity.model.durationMinutes.helpText")}
              addon={t("activity.model.durationMinutes.unit")}
            />
          </Label>
          <FormErrorMessage>
            {getErrorForField("durationMinutes")}
          </FormErrorMessage>

          {/* TODO: Create another checkbox - if set, don't navigate away */}
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
        </Form>
      </PageBody>
    </div>
  );
}

function getMinutesFromMidnight(startTimeRaw: FormDataEntryValue | null) {
  if (!startTimeRaw) {
    return null;
  }
  const [hours, minutes] = startTimeRaw.toString().split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
}
