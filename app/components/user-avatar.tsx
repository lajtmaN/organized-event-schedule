import clsx from "clsx";
import type { User } from "~/server/auth.server";

interface Props {
  url: User["avatarUrl"];
  className?: string;
}
export const UserAvatar = ({ url, className }: Props) => (
  <img
    className={clsx(
      "inline-block h-7 w-7 rounded-full ring-2 ring-white",
      className
    )}
    src={url}
    alt="User avatar"
  />
);

// fallback img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLTUgdy01IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOCAxMGE4IDggMCAxMS0xNiAwIDggOCAwIDAxMTYgMHptLTgtM2ExIDEgMCAwMC0uODY3LjUgMSAxIDAgMTEtMS43MzEtMUEzIDMgMCAwMTEzIDhhMy4wMDEgMy4wMDEgMCAwMS0yIDIuODNWMTFhMSAxIDAgMTEtMiAwdi0xYTEgMSAwIDAxMS0xIDEgMSAwIDEwMC0yem0wIDhhMSAxIDAgMTAwLTIgMSAxIDAgMDAwIDJ6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+Cjwvc3ZnPg=="
