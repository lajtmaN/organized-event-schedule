import { InformationCircleIcon } from "@heroicons/react/outline";
import { Alert } from "flowbite-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export const ErrorAlert = ({ children }: Props) => (
  <Alert color="failure" icon={InformationCircleIcon}>
    {children}
  </Alert>
);
