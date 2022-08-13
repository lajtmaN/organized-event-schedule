import { useLoaderData, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button } from "flowbite-react";
import { useState } from "react";
import { Trans } from "react-i18next";
import slug from "slug";
import invariant from "tiny-invariant";
import {
  CreateUpdateEventFields,
  CreateUpdateForm,
} from "~/components/events/create-update-form";
import { Heading } from "~/components/heading";
import { prisma } from "~/db.server";
import { notFound } from "~/server/utils/notFound";

export async function loader({ params }: LoaderArgs) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      published: true,
      slug: true,
    },
  });
  if (!event) {
    return notFound("Event not found");
  }
  return json({ event });
}

export async function action({ params, request }: ActionArgs) {
  invariant(params.slug, "slug is required in url");
  const formData = await request.formData();

  const name = formData.get("name");
  invariant(name && typeof name === "string", "name is required");

  const slug = formData.get("slug") ?? params.slug; // not provided if published
  invariant(slug && typeof slug === "string", "slug is required");

  const startDateRaw = formData.get("startDate");
  invariant(
    startDateRaw && typeof startDateRaw === "string",
    "startDate is required"
  );

  const endDateRaw = formData.get("endDate");
  invariant(
    endDateRaw && typeof endDateRaw === "string",
    "endDate is required"
  );

  const published = formData.get("published") === "on";

  await prisma.event.update({
    where: { slug: params.slug },
    data: {
      name,
      slug,
      startDate: new Date(startDateRaw),
      endDate: new Date(endDateRaw),
      published,
    },
  });
  return redirect(`/admin/event/${slug}`);
}

export default function EditEventRoute() {
  const { event } = useLoaderData<typeof loader>();
  const [suggestedSlug, setSuggestedSlug] = useState(event.slug);
  const transition = useTransition();

  const isSlugLocked = event.published;

  return (
    <>
      <Heading>
        <Trans i18nKey="admin.event.edit.title" />
      </Heading>
      <CreateUpdateForm>
        <CreateUpdateEventFields.Name
          defaultValue={event.name}
          onChange={
            isSlugLocked
              ? undefined
              : (evt) => setSuggestedSlug(slug(evt.target.value))
          }
        />
        <CreateUpdateEventFields.Slug
          value={suggestedSlug}
          onChange={(evt) => setSuggestedSlug(evt.target.value)}
          disabled={isSlugLocked}
        />
        <CreateUpdateEventFields.StartDate
          defaultValue={new Date(event.startDate)}
        />
        <CreateUpdateEventFields.EndDate
          defaultValue={new Date(event.endDate)}
        />
        <CreateUpdateEventFields.Published defaultValue={event.published} />
        <Button type="submit">
          <Trans
            i18nKey={
              transition?.state === "submitting"
                ? "admin.event.edit.submitting"
                : "admin.event.edit.submit"
            }
          />
        </Button>
      </CreateUpdateForm>
    </>
  );
}
