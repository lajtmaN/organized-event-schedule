import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export async function action({ params }: ActionArgs) {
  invariant(params.slug, "slug is required in url");
  await prisma.event.delete({
    where: { slug: params.slug },
  });
  return redirect("/admin");
}
interface Props {
  slug: string;
  className?: string;
  children: React.ReactNode;
}
export function DeleteEventButton({ slug, className, children }: Props) {
  const { t } = useTranslation();
  return (
    <Form
      method="post"
      className="inline-block"
      onSubmit={(evt) => {
        if (!confirm(t("admin.event.delete.confirm"))) {
          evt.preventDefault();
        }
      }}
      action={`/admin/event/${slug}/delete`}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </Form>
  );
}
