import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export async function loader({ params }: LoaderArgs) {
  const event = await prisma.event.findUniqueOrThrow({
    where: { slug: params.slug },
    select: {
      name: true,
    },
  });
  return json({
    title: event.name,
  });
}

export default function HeaderWidget() {
  const { title } = useLoaderData<typeof loader>();
  return <h1 className="text-xl font-bold text-gray-900">{title}</h1>;
}
