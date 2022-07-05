import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <h1>NNP event schedule</h1>
      <div className="mx-auto inline-grid grid-cols-2 gap-5">
        <Link
          to="/admin"
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-300"
        >
          Admin
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-300"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}
