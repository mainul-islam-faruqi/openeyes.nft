// import React, { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import LazyLoad from "react-lazyload";
// import { UseInfiniteQueryResult } from "react-query";
// import { Flex, BoxProps } from "@chakra-ui/react";
// import flatten from "lodash/flatten";
// import { EVENTS_PER_PAGE } from "config";
// import { SectionPlaceholder, Text } from "uikit";
// import { Event } from "types/graphql";
// import { ActivityRow } from "components/Activity";
// import { Container } from "components/Layout/Container";
// import useIntersectionObserver from "hooks/useIntersectionObserver";
// import { ActivityLoadingPlaceholder, ActivityLoadingSkeleton } from "./ActivityLoadingSkeleton";




import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LazyLoad from "react-lazyload";
import { UseInfiniteQueryResult } from "react-query";
import { Flex, BoxProps } from "@chakra-ui/react";
import flatten from "lodash/flatten";
import { EVENTS_PER_PAGE } from "config/constants";
import { SectionPlaceholder } from "uikit/Placeholder/SectionPlaceholder";
import Text from "uikit/theme/components/Text";
import { Event } from "types/graphql";
import { ActivityRow } from "./ActivityRow";
import { Container } from "../Layout/Container";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { ActivityLoadingPlaceholder, ActivityLoadingSkeleton } from "./ActivityLoadingSkeleton";






export interface ActivityResultsProps extends BoxProps {
  eventResults: UseInfiniteQueryResult<Event[], any>;
  isFixedGrid?: boolean;
}

export const ActivityResults = ({ eventResults, isFixedGrid = false, ...props }: ActivityResultsProps) => {
  const { t } = useTranslation();
  const { data: eventPages, isFetching, isLoading, isSuccess, hasNextPage, fetchNextPage } = eventResults;
  const { observerRef, isIntersecting } = useIntersectionObserver("200px");
  const shouldFetchNextPage = hasNextPage && isIntersecting && !isFetching;
  const showLoader = !isSuccess || (hasNextPage && (isFetching || isIntersecting));
  const showNextPageMessage = !hasNextPage && eventPages && eventPages.pages.length > EVENTS_PER_PAGE;

  const allEvents = flatten(eventPages?.pages);

  useEffect(() => {
    if (shouldFetchNextPage) {
      fetchNextPage();
    }
  }, [shouldFetchNextPage, fetchNextPage]);

  const renderEvents = () => {
    if (isLoading) {
      return <ActivityLoadingPlaceholder />;
    }

    return allEvents && allEvents.length > 0 ? (
      allEvents.map((event) => {
        return (
          <LazyLoad offset={400} key={event.id} placeholder={<ActivityLoadingSkeleton />} style={{ width: "100%" }}>
            <ActivityRow event={event} fixedGrid={isFixedGrid} />
          </LazyLoad>
        );
      })
    ) : (
      <SectionPlaceholder py={8}>
        <Text bold>{t("No activity found")}</Text>
      </SectionPlaceholder>
    );
  };

  return (
    <Container py={6} px={0} {...props}>
      {renderEvents()}
      {showLoader && <ActivityLoadingPlaceholder />}
      {showNextPageMessage && (
        <Flex alignItems="center" justifyContent="center" pt={8}>
          <Text color="text-02">{t("That's all!")}</Text>
        </Flex>
      )}
      <div ref={observerRef} />
    </Container>
  );
};
