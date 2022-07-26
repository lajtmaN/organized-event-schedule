import { ChevronRightIcon } from "@heroicons/react/outline";
import type { RouteMatch } from "@remix-run/react";
import { NavLink } from "@remix-run/react";
import { useMatches } from "@remix-run/react";

interface BreadcrumbRoute {
  pathId: string;
  displayName: (route: RouteMatch) => string;
}
const BreadcrumbRoutes: BreadcrumbRoute[] = [
  {
    pathId: "root",
    displayName: () => "Home",
  },
  {
    pathId: "routes/admin",
    displayName: () => "Events",
  },
  {
    pathId: "routes/admin/event/$slug",
    displayName: (route) => route.params.slug ?? "Event",
  },
];

export const Breadcrumbs = () => {
  const matches = useMatches();
  console.log(matches);
  const breadcrumbs = matches
    .map((match) => {
      const breadcrumb = BreadcrumbRoutes.find((route) =>
        route.pathId.startsWith(match.id)
      );
      if (!breadcrumb) {
        return null;
      }
      return (
        <NavLink
          to={match.pathname}
          key={match.pathname}
          className="hover:text-indigo-600"
        >
          {breadcrumb.displayName(match)}
        </NavLink>
      );
    })
    .reduce((acc, curr) => (
      <>
        {acc}
        {curr ? (
          <>
            <ChevronRightIcon className="mx-1 inline-block w-3" />
            {curr}
          </>
        ) : null}
      </>
    ));
  return <div className="mx-auto max-w-7xl px-6 lg:px-8">{breadcrumbs}</div>;
};
