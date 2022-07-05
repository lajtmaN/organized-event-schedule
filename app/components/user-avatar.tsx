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
