import { Link } from "~/components/link";

export default function Index() {
  return (
    <main>
      <h1>NNP event schedule</h1>
      <div className="mx-auto inline-grid grid-cols-2 gap-5">
        <Link to="/admin">Admin</Link>
        <Link to="/login">Log In</Link>
      </div>
    </main>
  );
}
