import { ExclamationIcon } from "@heroicons/react/outline";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { SocialsProvider } from "remix-auth-socials";
import { DiscordIcon } from "~/components/discord-icon";
import { authenticator } from "~/server/auth.server";
import { getSession } from "~/services/session.server";

type LoaderData = {
  error: { message: string } | null;
};
export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  });

  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  return json<LoaderData>({ error });
};

export default function Login() {
  const { error } = useLoaderData<LoaderData>();
  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-4 py-12 px-6 lg:px-8">
      <SocialButton
        provider={SocialsProvider.DISCORD}
        label="Login with Discord"
      />
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50/50 p-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <ExclamationIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center ">
            <h3 className="text-lg font-medium leading-6 text-red-600">
              Not allowed
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{error.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SocialButtonProps {
  provider: SocialsProvider;
  label: string;
}

const SocialButton = ({ provider, label }: SocialButtonProps) => (
  <Form
    action={`/auth/${provider}`}
    method="post"
    name={`${provider}-login-form`}
  >
    <button
      type="submit"
      className="group relative flex w-72 justify-center rounded-md border border-transparent bg-discord py-3 px-4 text-sm font-medium text-white hover:bg-discord/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
        <DiscordIcon />
      </span>
      {label}
    </button>
  </Form>
);
