interface Props {
  children: React.ReactNode;
}
export const Heading = ({ children }: Props) => (
  <h2 className="text-xl font-bold text-gray-900">{children}</h2>
);
