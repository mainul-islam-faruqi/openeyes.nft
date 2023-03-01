import { useTranslation } from "next-i18next";
import { Box } from "@chakra-ui/react";
import { Text } from "uikit/Text/Text";
import { HttpError } from "./HttpError";

export const ServerError = () => {
  const { t } = useTranslation();
  return (
    <HttpError
      statusMessage={t("Error {{statusCode}} - {{statusMsg}}", {
        statusCode: 500,
        statusMsg: t("Internal Server Error"),
      })}
      title={t("This page isn’t working right :/")}
      description={
        <Box mb={8}>
          <Text as="p" color="text-02">
            {t("LooksBroken ( ; _ ;)")}
          </Text>{" "}
          <Text as="p" color="text-02">
            {t("Sorry, you can’t access this page for now. Try again later.")}
          </Text>
        </Box>
      }
    />
  );
};
