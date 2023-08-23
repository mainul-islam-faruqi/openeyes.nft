import { HttpError } from "./HttpError";
import { useTranslation } from "next-i18next";

export const Forbidden = () => {
  const { t } = useTranslation();
  return (
    <HttpError
      statusMessage={t("Error {{statusCode}} - {{statusMsg}}", { statusCode: 403, statusMsg: t("Forbidden") })}
      title={t("Sorry, You’re Not Allowed in Here ಠ_ಠ")}
      description={t("You don’t have have permission to access this page or resource.")}
    />
  );
};
