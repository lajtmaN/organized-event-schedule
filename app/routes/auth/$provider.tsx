import { redirect } from "@remix-run/server-runtime";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/server/auth.server";
import invariant from "tiny-invariant";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request, params }) => {
  invariant(params.provider, "Provider is required as part of the url");
  return authenticator.authenticate(params.provider, request);
};
