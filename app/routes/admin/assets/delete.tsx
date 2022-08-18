import { TrashIcon } from "@heroicons/react/outline";
import { useFetcher } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button, Spinner } from "flowbite-react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export function loader() {
  return redirect("/admin/assets");
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const assetId = formData.get("assetId");
  invariant(assetId && typeof assetId === "string", "assetId is required");
  invariant(
    request.method.toLowerCase() === "delete",
    "request.method must be 'delete'"
  );

  await prisma.asset.delete({
    where: { id: assetId },
  });
  return json({ ok: true });
}

interface Props {
  assetId: string;
  className?: string;
}
export function AssetsDeleteButton({ assetId, className }: Props) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="delete"
      action="/admin/assets/delete"
      className={className}
    >
      <input type="hidden" value={assetId} name="assetId" />
      <Button type="submit" pill color="failure">
        {fetcher.state === "idle" ? (
          <TrashIcon className="h-4" />
        ) : (
          <Spinner className="h-4" />
        )}
      </Button>
    </fetcher.Form>
  );
}
