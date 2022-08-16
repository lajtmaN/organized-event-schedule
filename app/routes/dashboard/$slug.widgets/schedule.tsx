import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export function loader({ params }: LoaderArgs) {
  return redirect(`/schedule/${params.slug}?mode=kiosk`);
}
