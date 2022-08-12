import type { BadgeColors } from "flowbite-react";
import { Badge } from "flowbite-react";
import { useTranslation } from "react-i18next";
import type { EventStatus } from "~/services/event.server";

interface Props {
  status: EventStatus;
}

export const StatusBadge = ({ status }: Props) => {
  const { t } = useTranslation();
  return (
    <Badge color={badgeColor(status)}>
      {t(`event.model.status.${status}`)}
    </Badge>
  );
};

const badgeColor = (status: EventStatus): keyof BadgeColors | undefined => {
  switch (status) {
    case "draft":
      return "gray";
    case "live":
      return "success";
    default:
      return undefined;
  }
};
