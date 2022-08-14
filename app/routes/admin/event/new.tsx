import { useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button } from "flowbite-react";
import { Trans } from "react-i18next";
import slug from "slug";
import invariant from "tiny-invariant";
import { ErrorAlert } from "~/components/error-alert";
import {
  CreateUpdateEventFields,
  CreateUpdateForm,
} from "~/components/event/create-update-form";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  invariant(name && typeof name === "string", "name is required");

  const startDateRaw = formData.get("startDate");
  invariant(
    startDateRaw && typeof startDateRaw === "string",
    "startDate is required"
  );
  const startDate = new Date(startDateRaw);

  const endDateRaw = formData.get("endDate");
  invariant(
    endDateRaw && typeof endDateRaw === "string",
    "endDate is required"
  );
  const endDate = new Date(endDateRaw);

  try {
    if (startDate > endDate) {
      throw new Error("Start date must be before end date");
    }
    const ThreeDaysInMilliseconds = 1000 * 60 * 60 * 24 * 3;
    if (endDate.getTime() - startDate.getTime() > ThreeDaysInMilliseconds) {
      throw new Error("Event must be less than 3 days");
    }

    const event = await prisma.event.create({
      data: {
        name,
        slug: slug(name),
        published: false,
        startDate,
        endDate,
      },
    });
    return redirect(`/admin/event/${event.slug}`);
  } catch (e) {
    return json(
      { message: "Could not create event", error: (e as Error)?.message },
      { status: 500 }
    );
  }
}

export default function CreateNewEventRoute() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <PageHeaderTitle>
        <Trans i18nKey="admin.event.create.title" />
      </PageHeaderTitle>
      <PageBody>
        <CreateUpdateForm>
          <CreateUpdateEventFields.Name />
          <CreateUpdateEventFields.StartDate />
          <CreateUpdateEventFields.EndDate />

          <Button type="submit">
            <Trans i18nKey="admin.event.create.submit" />
          </Button>
          {actionData?.message ? (
            <ErrorAlert>
              {actionData.message}: {actionData.error}
            </ErrorAlert>
          ) : null}
        </CreateUpdateForm>
      </PageBody>
    </div>
  );
}
