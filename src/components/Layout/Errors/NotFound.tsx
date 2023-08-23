import { HttpError } from "./HttpError";
import { useTranslation } from "next-i18next";

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <HttpError
      statusMessage={t("Error {{statusCode}} - {{statusMsg}}", { statusCode: 404, statusMsg: "Not Found" })}
      title={t("Sorry... Can’t Find That Page :(")}
      description={t(
        "Double-check the URL for errors, try another search, look down the back of the couch, or try again later."
      )}
    />
  );
};
