import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getEnvVariable } from "~/server/environment.server";
import type { WidgetType } from "~/services/dashboard.server";
import { determineWidgetRoute, WidgetTypes } from "~/services/dashboard.server";
import styles from "./dashboard.css";

type Widgets = { [key in WidgetType]: string | null };
export function loader({ params }: LoaderArgs) {
  const slug = params.slug;
  invariant(slug, "slug is required");
  const base = getEnvVariable("BASE_URL");
  const widgets = WidgetTypes.reduce(
    (acc, type) => ({
      ...acc,
      [type]: base + determineWidgetRoute(type, slug),
    }),
    {}
  ) as Widgets;
  return json({
    widgets,
  });
}

export default function DashboardRoute() {
  const { widgets } = useLoaderData<typeof loader>();
  return (
    <div className="dashboard-grid gap-3 p-3 lg:gap-8 lg:p-8">
      <div className="grid-area grid-area-header">
        <Widget url={widgets["header"]} title="header" />
      </div>
      <div className="grid-area grid-area-logo">
        <Widget
          url={widgets["logo"]}
          title="logo"
          className="float-right flex h-40 w-40"
        />
      </div>
      <div className="grid-area grid-area-main-widget">
        <Widget url={widgets["main-widget"]} title="main-widget" />
      </div>
      <div className="grid-area grid-area-widget-1">
        <Widget url={widgets["widget-1"]} title="widget-1" />
      </div>
      <div className="grid-area grid-area-widget-2">
        <Widget url={widgets["widget-2"]} title="widget-2" />
      </div>
      <div className="grid-area grid-area-widget-3">
        <Widget url={widgets["widget-3"]} title="widget-3" />
      </div>
      <div className="grid-area grid-area-footer">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface WidgetProps {
  url: string | null;
  title: string;
  className?: string;
}
const Widget = ({ url, title, className = "h-full w-full" }: WidgetProps) =>
  url ? <iframe src={url} title={title} className={className} /> : null;
