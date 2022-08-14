import { Link as RemixLink } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";

export const Link = (props: RemixLinkProps) => (
  <RemixLink
    {...props}
    className={clsx(
      "flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-6 py-2 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-300",
      props.className
    )}
  />
);
export const MinimalisticLink = (props: RemixLinkProps) => (
  <RemixLink
    {...props}
    className={clsx(MinimalisticLinkStyling, props.className)}
  />
);

export const MinimalisticLinkStyling =
  "text-base text-indigo-500 hover:text-indigo-700 hover:underline" as const;

export const DangerMinimalisticLinkStyling =
  "text-base text-red-500 hover:text-red-700 hover:underline" as const;
