import clsx from "clsx";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export const FormErrorMessage = ({ className, children }: Props) => (
  <span className={clsx(className, "text-sm text-red-500")}>{children}</span>
);
