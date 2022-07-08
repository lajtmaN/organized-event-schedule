import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { ErrorAlert } from "~/components/error-alert";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { prisma } from "~/db.server";

type LoaderData = {
  event?: {
    id: string;
    name: string;
  };
  error?: {
    message: string;
  };
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.slug;
  invariant(slug, "slug is required");
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return json<LoaderData>(
      { error: { message: "Event not found" } },
      { status: 404 }
    );
  }
  return json<LoaderData>({ event });
};

export default function Event() {
  const { event, error } = useLoaderData<LoaderData>();
  if (error || !event) {
    return <ErrorAlert>{error?.message}</ErrorAlert>;
  }
  return (
    <div>
      <PageHeaderTitle>{event.name}</PageHeaderTitle>
      <PageBody>
        <ul>
          <li>TODO:</li>
          <li>Tabel med aktiviteter</li>
          <li>Opret ny aktivitet</li>
          <li>Links til tidsplan og dashboard</li>
        </ul>
      </PageBody>
    </div>
  );
}
