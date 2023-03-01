import React from "react";
import { Popover, Text, TextProps, TooltipText } from "uikit";

const MAX_TITLE_LENGTH = 30; // The approximate length before a title is truncated on the largest screen

interface NftCardTitleProps extends TextProps {
  title: string;
}

export const NftCardTitle = ({ title, ...props }: NftCardTitleProps) => {
  const titleComponent = (
    <Text textStyle="helper" color="text-02" bold mb={2} isTruncated {...props}>
      {title}
    </Text>
  );

  if (title.length >= MAX_TITLE_LENGTH) {
    return (
      <Popover label={<TooltipText>{title}</TooltipText>} placement="top" contentProps={{ p: 2 }}>
        {titleComponent}
      </Popover>
    );
  }

  return titleComponent;
};
