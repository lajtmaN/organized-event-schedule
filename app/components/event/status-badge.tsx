import clsx from "clsx";
import type { BadgeColors, BadgeProps } from "flowbite-react";
import { Badge } from "flowbite-react";
import { useTranslation } from "react-i18next";
import type { EventStatus } from "~/services/event.server";

interface Props {
  status: EventStatus;
  className?: string;
  badge?: BadgeProps;
}

export const StatusBadge = ({ status, className, badge }: Props) => {
  const { t } = useTranslation();
  return (
    <span className={clsx("inline-block", className)}>
      <Badge {...badge} color={badgeColor(status)}>
        {t(`event.model.status.${status}`)}
      </Badge>
    </span>
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
