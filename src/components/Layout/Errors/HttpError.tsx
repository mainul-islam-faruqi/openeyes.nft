// import { ReactNode } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Box, useColorModeValue } from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
// import { Button, Text } from "uikit";
// import Page, { PageProps } from "../Page";
// import { Container } from "../Container";





import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
// import { Button, Text } from "uikit";
import { Button } from "uikit/Button/Button";
import { Text } from "uikit/Text/Text";
import Page, { PageProps } from "../Page";
import { Container } from "../Container";




export interface HttpErrorProps extends PageProps {
  statusMessage?: string;
  title: string;
  description: ReactNode;
}

export const HttpError = ({ statusMessage, title, description, ...props }: HttpErrorProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Page {...props}>
      <Container alignItems="center" display="flex" minHeight={{ base: "auto", lg: "calc(90vh - 5rem)" }}>
        <Box
          backgroundImage={`url('/images/${useColorModeValue("biglooks-light.svg", "biglooks-dark.svg")}')`}
          backgroundPosition="right top"
          backgroundRepeat="no-repeat"
          backgroundSize="50%"
          py={{ base: 16, lg: 32 }}
          flex={1}
        >
          <Box maxWidth="553px">
            {statusMessage && (
              <Text as="h2" color="text-03" bold textStyle="display-03" mb={8}>
                {statusMessage}
              </Text>
            )}
            <Text as="h1" bold textStyle="display-02" mb={8}>
              {title}
            </Text>
            {typeof description === "string" ? (
              <Text color="text-02" mb={8}>
                {description}
              </Text>
            ) : (
              description
            )}
            <Button variant="outline" onClick={() => router.back()} mr={2}>
              {t("Go Back")}
            </Button>
            <Link href="/" passHref>
              <Button as="a">{t("Take Me Home")}</Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};
