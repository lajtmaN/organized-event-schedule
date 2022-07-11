export const ActivityTypes = ["tournament", "mystery", "other"] as const;
export type ActivityType = typeof ActivityTypes[number];

export const parseActivityType = (type: string): ActivityType => {
  switch (type) {
    case "tournament":
    case "mystery":
    case "other":
      return type;
    default:
      throw new Error(`Unknown activity type: ${type}`);
  }
};
