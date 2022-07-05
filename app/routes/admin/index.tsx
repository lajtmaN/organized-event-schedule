import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import clsx from "clsx";
import { useState } from "react";
import { useInterval } from "react-use";
import { UserAvatar } from "~/components/user-avatar";
import type { User } from "~/server/auth.server";
import { authenticator } from "~/server/auth.server";

type LoaderData = {
  user: User;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json<LoaderData>({ user });
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();
  const [showLogout, setShowLogout] = useState(false);

  useInterval(() => setShowLogout(false), 3000);
  return (
    <>
      <nav className="relative flex items-center justify-between bg-gray-800 py-4 px-6">
        <div>
          <h1 className="text-xl text-white">Admin</h1>
        </div>
        <div
          className="cursor-pointer rounded-md border border-transparent p-2 text-lg text-white hover:border-gray-500 hover:bg-gray-600"
          onClick={() => setShowLogout((cur) => !cur)}
        >
          <Form
            action="/logout"
            method="post"
            className={showLogout ? "block" : "hidden"}
          >
            <button type="submit">Click again to logout</button>
          </Form>

          <div
            className={clsx(
              showLogout ? "hidden" : "block",
              "flex items-center space-x-4"
            )}
          >
            <UserAvatar url={user.avatarUrl} /> <span>{user.displayName}</span>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
