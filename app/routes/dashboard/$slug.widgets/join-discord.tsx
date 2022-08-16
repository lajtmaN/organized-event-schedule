import { useTranslation } from "react-i18next";
import { DiscordIcon } from "~/components/discord-icon";

export default function JoinDiscordWidget() {
  const { t } = useTranslation();
  return (
    <a
      href={t("widget.join-discord.href")}
      target="_blank"
      className="flex cursor-pointer flex-row items-center justify-center space-x-5 rounded-lg bg-discord p-4 text-white hover:opacity-70"
      rel="noreferrer"
    >
      <DiscordIcon />
      <div>
        <p>{t("widget.join-discord.title")}</p>
        <p className="text-sm">{t("widget.join-discord.subtitle")}</p>
      </div>
    </a>
  );
}
