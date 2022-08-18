import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import invariant from "tiny-invariant";
import { Heading } from "~/components/heading";
import { PageBody } from "~/components/page-body";
import { PageHeaderTitle } from "~/components/page-header";
import { RequiredMark } from "~/components/required-mark";
import { prisma } from "~/db.server";
import type { AssetType } from "~/models/asset-type";
import { parseAssetType } from "~/models/asset-type";
import { getAssetsOfType } from "~/services/asset.server";
import { AssetsDeleteButton } from "./delete";

export async function loader() {
  const sponsors = await getAssetsOfType("sponsor");
  const logo = await getAssetsOfType("logo");
  return json({
    sponsors,
    logo: logo.length > 0 ? logo[0] : null,
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const url = formData.get("url");
  const type = formData.get("type");
  invariant(name && typeof name === "string", "name is required");
  invariant(url && typeof url === "string", "url is required");
  invariant(type && typeof type === "string", "type is required");
  await prisma.asset.create({
    data: {
      name,
      url,
      type: parseAssetType(type),
    },
  });
  return json({ ok: true });
}

export default function AssetsIndexRoute() {
  const { logo, sponsors } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageHeaderTitle>
        <Trans i18nKey="admin.assets.title" />
      </PageHeaderTitle>
      <PageBody>
        <Heading>
          <Trans i18nKey="asset.model.type.logo" />
        </Heading>
        {logo ? (
          <div className="relative w-72">
            <Card>
              <img src={logo.url} alt={logo.name} />
            </Card>

            <AssetsDeleteButton
              assetId={logo.id}
              className="absolute top-1 right-1"
            />
          </div>
        ) : (
          <UploadAssetForm type="logo" />
        )}
        <hr className="my-4" />
        <Heading>
          <Trans i18nKey="asset.model.type.sponsor" />
        </Heading>
        <div className="grid grid-cols-auto-w-72 gap-3">
          {sponsors?.map((sponsor) => (
            <div key={sponsor.id} className="w-72 self-stretch">
              <Card>
                <img src={sponsor.url} alt={sponsor.name} />
                <h5 className="text-xl font-bold">{sponsor.name}</h5>
                <div className="relative">
                  <AssetsDeleteButton
                    assetId={sponsor.id}
                    className="absolute bottom-1 right-1"
                  />
                </div>
              </Card>
            </div>
          ))}
          <UploadAssetForm type="sponsor" />
        </div>
      </PageBody>
    </div>
  );
}

const UploadAssetForm = ({ type }: { type: AssetType }) => {
  const [url, setUrl] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<typeof action>();
  useEffect(() => {
    if (actionData?.ok) {
      formRef.current?.reset();
      setUrl("");
    }
  }, [actionData]);

  return (
    <Form method="post" className="w-72" ref={formRef}>
      <Card>
        {url && <img src={url} alt="asset-preview" />}
        {url && <hr />}
        <input type="hidden" name="type" value={type} />
        <Label>
          <Trans i18nKey="asset.model.name" />
          <RequiredMark />
          <TextInput name="name" required />
        </Label>
        <Label>
          <Trans i18nKey="asset.model.url" />
          <RequiredMark />
          <TextInput
            name="url"
            value={url}
            required
            onChange={(e) => setUrl(e.target.value)}
          />
        </Label>
        <Button type="submit">Tilføj ny</Button>
      </Card>
    </Form>
  );
};
