import { Form } from "@remix-run/react";
import type { SelectProps, TextInputProps } from "flowbite-react";
import { Label, Select, TextInput } from "flowbite-react";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FormErrorMessage } from "~/components/form-error-message";
import { RequiredMark } from "~/components/required-mark";
import type { DayOfWeek } from "~/models/activity-dates";
import {
  DaysOfWeek,
  getMinutesFromMidnight,
  parseDayOfWeek,
} from "~/models/activity-dates";
import type { ActivityType } from "~/models/activity-type";
import { ActivityTypes, parseActivityType } from "~/models/activity-type";

export const CreateUpdateForm = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Form
    method="post"
    className="mt-3 flex flex-col gap-4 rounded-md border p-5 shadow-md"
  >
    {children}
  </Form>
);

interface TextFieldProps<ValueType = string>
  extends Omit<TextInputProps, "defaultValue"> {
  error?: string;
  defaultValue?: ValueType;
}
interface SelectFieldProps<ValueType = string>
  extends Omit<SelectProps, "defaultValue"> {
  error?: string;
  defaultValue?: ValueType;
}
export const CreateUpdateActivityFields = {
  Name: ({ error, defaultValue }: TextFieldProps) => (
    <Label>
      <span>
        <Trans i18nKey="activity.model.name" />
        <RequiredMark />
      </span>
      <TextInput name="name" required defaultValue={defaultValue} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  Type: ({ error, defaultValue, ...rest }: SelectFieldProps<ActivityType>) => {
    const { t } = useTranslation();
    return (
      <Label>
        <span>
          {t("activity.model.type")}
          <RequiredMark />
        </span>
        <Select {...rest} name="type" required defaultValue={defaultValue}>
          {ActivityTypes.map((type) => (
            <option value={type} key={type}>
              {t(`activity.model.type.${type}`)}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </Label>
    );
  },
  DayOfWeek: ({ error, defaultValue }: SelectFieldProps<DayOfWeek>) => {
    const { t } = useTranslation();
    return (
      <Label>
        <span>
          {t("activity.model.dayOfWeek")}
          <RequiredMark />
        </span>
        <Select name="dayOfWeek" required defaultValue={defaultValue}>
          {DaysOfWeek.map((dayOfWeek) => (
            <option value={dayOfWeek} key={dayOfWeek}>
              {t(`activity.model.dayOfWeek.${dayOfWeek}`)}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </Label>
    );
  },
  StartTime: ({ error, defaultValue }: TextFieldProps) => (
    <Label>
      <span>
        <Trans i18nKey="activity.model.time" />
        <RequiredMark />
      </span>
      {/* TODO: Set min and max */}
      <TextInput
        type="time"
        name="startTime"
        required
        defaultValue={defaultValue}
        helperText={<Trans i18nKey="activity.model.time.helpText" />}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  DurationMinutes: ({ error, defaultValue }: TextFieldProps<number>) => (
    <Label>
      <span>
        <Trans i18nKey="activity.model.durationMinutes" />
      </span>
      <TextInput
        type="number"
        name="durationMinutes"
        defaultValue={defaultValue}
        helperText={<Trans i18nKey="activity.model.durationMinutes.helpText" />}
        addon={<Trans i18nKey="activity.model.durationMinutes.unit" />}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  RegistrationDeadline: ({ error, defaultValue }: TextFieldProps<number>) => (
    <Label>
      <Trans i18nKey="activity.model.registration.deadline" />
      <TextInput
        type="number"
        name="registrationDeadline"
        defaultValue={defaultValue}
        helperText={
          <Trans i18nKey="activity.model.registration.deadline.helpText" />
        }
        addon={<Trans i18nKey="activity.model.registration.deadline.unit" />}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
};

export const extractActivityFromFormData = (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const type = parseActivityType(formData.get("type")?.toString() ?? "");
  const dayOfWeek = parseDayOfWeek(formData.get("dayOfWeek")?.toString() ?? "");
  const startTimeRaw = formData.get("startTime");
  const minutesFromMidnight = getMinutesFromMidnight(startTimeRaw);
  const durationRaw = formData.get("durationMinutes");
  const duration = durationRaw ? parseInt(durationRaw.toString()) : null;
  const registrationDeadlineRaw = formData.get("registrationDeadline");
  const registrationDeadlineMinutes = registrationDeadlineRaw
    ? parseInt(registrationDeadlineRaw.toString())
    : null;

  const errors: Array<{ field: string; error: string }> = [];
  if (!name) errors.push({ field: "name", error: "Name is required" });
  if (!type) errors.push({ field: "type", error: "Type is required" });
  if (!dayOfWeek)
    errors.push({ field: "dayOfWeek", error: "Day of week is required" });
  if (minutesFromMidnight == null)
    errors.push({ field: "startTime", error: "Start time is required" });

  return {
    errors,
    activity: {
      name: name!,
      type,
      dayOfWeek,
      minutesFromMidnight: minutesFromMidnight!,
      duration,
      registrationDeadlineMinutes,
    },
  };
};
