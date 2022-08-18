import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getAssetsOfType } from "~/services/asset.server";

export async function loader() {
  const logo = await getAssetsOfType("logo");
  return json({
    logo: logo.length > 0 ? logo[0] : null,
  });
}

export default function LogoWidget() {
  const { logo } = useLoaderData<typeof loader>();
  if (!logo) {
    return null;
  }
  return (
    <img src={logo.url} alt="Logo" className="h-full w-full object-cover" />
  );
}
