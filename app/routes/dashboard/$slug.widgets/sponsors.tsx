import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { Carousel } from "flowbite-react";
import { getAssetsOfType } from "~/services/asset.server";

export async function loader() {
  const assets = await getAssetsOfType("sponsor");
  return json({
    assets,
  });
}
export default function SponsorsWidget() {
  const { assets } = useLoaderData<typeof loader>();

  return (
    <Carousel
      slideInterval={4000}
      leftControl={<div />}
      rightControl={<div />}
      indicators={false}
    >
      {assets?.map((asset) => (
        <img src={asset.url} alt={asset.name} key={asset.id} />
      ))}
    </Carousel>
  );
}
