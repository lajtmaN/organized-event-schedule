import { Link as RemixLink } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";

export const Link = (props: RemixLinkProps) => (
  <RemixLink
    {...props}
    className={clsx(
      props.className,
      "flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-6 py-2 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-300"
    )}
  />
);
