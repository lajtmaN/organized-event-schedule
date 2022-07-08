import type { ReactNode } from "react";

export const PageHeader = ({ children }: { children: ReactNode }) => (
  <header className="bh-white shadow">
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </header>
);

export const PageHeaderTitle = ({ children }: { children: ReactNode }) => (
  <PageHeader>
    <h1 className="text-3xl font-bold text-gray-900">{children}</h1>
  </PageHeader>
);
