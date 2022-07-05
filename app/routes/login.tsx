import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { SocialsProvider } from "remix-auth-socials";
import { authenticator } from "~/server/auth.server";
import { getSession } from "~/services/session.server";
import { ExclamationIcon } from "@heroicons/react/outline";

type LoaderData = {
  error: { message: string } | null;
};
export const loader: LoaderFunction = async ({ request }) => {
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
  <Form action={`/auth/${provider}`} method="post">
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

const DiscordIcon = () => (
  <svg
    width="256px"
    height="256px"
    viewBox="0 -28.5 256 256"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    preserveAspectRatio="xMidYMid"
    className="h-8 w-8"
  >
    <g>
      <path
        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        fill="white"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
