import { redirect } from "@remix-run/server-runtime";

export function loader() {
  // Retrieve the latest event slug and redirect to it.
  const slug = "latest";
  return redirect(`/schedule/${slug}`);
}
