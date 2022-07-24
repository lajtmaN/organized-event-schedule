import { Form } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { RequiredMark } from "~/components/required-mark";
import { DaysOfWeek } from "~/models/activity-dates";
import { ActivityTypes } from "~/models/activity-type";
import { createActivity } from "~/services/activity.server";
import { eventExistsOrThrow } from "~/services/event.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await eventExistsOrThrow(params.slug);
  return null;
};

interface ActionData {
  result: {};
  errors?: { [field: string]: string };
}
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const type = formData.get("type");
  const dayOfWeek = formData.get("dayOfWeek");
  const startTimeRaw = formData.get("startTime");
  const minutesFromMidnight = getMinutesFromMidnight(startTimeRaw);
  const durationRaw = formData.get("durationMinutes");
  const duration = durationRaw ? parseInt(durationRaw.toString()) : null;
  // TODO validate how to check required fields are entered, and throw human readable error if not
  // const errors = {
  //   name: ,
  // }
  // console.log("todo", data);
  // createActivity({});
  return null;
};

const RequiredFields = ["name", "type", "dayOfWeek", "startTime"];

export default function CreateActivity() {
  const { t } = useTranslation();
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
          </Label>
          <Label>
            <span>
              {t("activity.model.time")}
              <RequiredMark />
            </span>
            {/* TODO: Set min and max */}
            <TextInput
              type="time"
              name="time"
              required
              helperText={t("activity.model.time.helpText")}
            />
          </Label>
          <Label>
            <span>{t("activity.model.durationMinutes")}</span>
            <TextInput
              type="number"
              name="durationMinutes"
              helperText={t("activity.model.durationMinutes.helpText")}
            />
          </Label>
          <Button type="submit">
            {t("admin.event.activities.create.submit")}
          </Button>
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
