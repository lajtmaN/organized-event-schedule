import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { authenticator } from "~/server/auth.server";

export let loader: LoaderFunction = ({ request, params }) => {
  invariant(params.provider, "Provider is required as part of the url");
  return authenticator.authenticate(params.provider, request, {
    successRedirect: "/admin",
    failureRedirect: "/login",
  });
};
