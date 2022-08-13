import { Form } from "@remix-run/react";
import type { TextInputProps } from "flowbite-react";
import { Checkbox, Label, TextInput } from "flowbite-react";
import React from "react";
import { Trans } from "react-i18next";
import { FormErrorMessage } from "~/components/form-error-message";
import { RequiredMark } from "~/components/required-mark";
import {
  getMinutesFromMidnight,
  parseDayOfWeek,
} from "~/models/activity-dates";
import { parseActivityType } from "~/models/activity-type";

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

interface FieldProps<ValueType = string>
  extends Omit<TextInputProps, "defaultValue"> {
  error?: string;
  defaultValue?: ValueType;
}
export const CreateUpdateEventFields = {
  Name: ({ error, defaultValue, ...rest }: FieldProps) => (
    <Label>
      <span>
        <Trans i18nKey="event.model.name" />
        <RequiredMark />
      </span>
      <TextInput name="name" required defaultValue={defaultValue} {...rest} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  Slug: ({ error, defaultValue, ...rest }: FieldProps) => (
    <Label>
      <span>
        <Trans i18nKey="event.model.slug" />
        <RequiredMark />
      </span>
      <TextInput
        name="slug"
        required
        defaultValue={defaultValue}
        helperText={<Trans i18nKey="event.model.slug.helpText" />}
        {...rest}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  StartDate: ({ error, defaultValue }: FieldProps<Date>) => (
    <Label>
      <span>
        <Trans i18nKey="event.model.startDate" />
        <RequiredMark />
      </span>
      <TextInput
        type="datetime-local"
        step={60 * 15}
        name="startDate"
        required
        defaultValue={dateToString(defaultValue)}
        helperText={<Trans i18nKey="event.model.startDate.helpText" />}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  EndDate: ({ error, defaultValue }: FieldProps<Date>) => (
    <Label>
      <span>
        <Trans i18nKey="event.model.endDate" />
        <RequiredMark />
      </span>
      <TextInput
        type="datetime-local"
        name="endDate"
        required
        defaultValue={dateToString(defaultValue)}
        helperText={<Trans i18nKey="event.model.endDate.helpText" />}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </Label>
  ),
  Published: ({ error, defaultValue }: FieldProps<boolean>) => (
    <Label>
      <div className="flex items-center space-x-2">
        <Checkbox name="published" defaultChecked={defaultValue} />
        <span>
          <Trans i18nKey="event.model.published" />
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        <Trans i18nKey="event.model.published.helpText" />
      </p>
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
    },
  };
};

/**
 * Convert date object into a string in the format YYYY-MM-DDTHH:mm.
 */
export const dateToString = (date: Date | undefined) => {
  return date?.toISOString().slice(0, -8);
};
