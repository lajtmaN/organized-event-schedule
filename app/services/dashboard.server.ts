export const WidgetTypes = [
  "header",
  "logo",
  "footer",
  "main-widget",
  "widget-1",
  "widget-2",
  "widget-3",
] as const;
export type WidgetType = typeof WidgetTypes[number];
export const determineWidgetRoute = (widget: WidgetType, slug: string) => {
  const base = (sub: string) => `/dashboard/${slug}/widgets/${sub}` as const;
  switch (widget) {
    case "header":
      return base("header");
    case "logo":
      return base("logo");
    case "footer":
      return null;
    case "main-widget":
      return base("schedule"); // TODO set to bordplan in the first couple of hours of an event
    case "widget-1":
      return base("join-discord");
    case "widget-2":
      return base("countdown"); // TODO if there is any at the moment?
    case "widget-3":
      return base("sponsors");
    default:
      throw new Error(`Unknown widget type: ${widget}`);
  }
};

// TODO Other widget ideas: network statistics
