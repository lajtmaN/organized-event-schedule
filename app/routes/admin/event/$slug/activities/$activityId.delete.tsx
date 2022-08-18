import { useFetcher, useParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { deleteActivity } from "~/services/activity.server";

export async function action({ params }: ActionArgs) {
  invariant(params.activityId, "activityId is required");
  await deleteActivity(params.activityId);
  return redirect(`/admin/event/${params.slug}`);
}

interface Props {
  activityId: string;
  className?: string;
  children: React.ReactNode;
}
export function DeleteActivityButton({
  activityId,
  className,
  children,
}: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="post"
      className="inline-block"
      onSubmit={(evt) => {
        if (!confirm(t("admin.event.activities.delete.confirm"))) {
          evt.preventDefault();
        }
      }}
      action={`/admin/event/${params.slug}/activities/${activityId}/delete`}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </fetcher.Form>
  );
}
