// import Link from "next/link";
// import { Text, TextProps, VerifiedIcon } from "uikit";
// import { TextButton } from "./TextButton";



import Link from "next/link";
// import { Text, TextProps, VerifiedIcon } from "uikit";
import { Text, TextProps } from "uikit/Text/Text";
import { VerifiedIcon } from "uikit";
import { TextButton } from "./TextButton";




interface Props {
  name: string;
  address: string;
  isVerified?: boolean;
  textProps?: TextProps;
}

export const CollectionLinkButton: React.FC<Props> = ({ name, address, isVerified, textProps }) => {
  return (
    <Link href={`/collections/${address}`} data-id="collection-link-button">
      <a>
        <TextButton width="100%" variant="ghost" colorScheme="gray">
          {isVerified && <VerifiedIcon boxSize={4} mr={1} />}
          <Text isTruncated textStyle="helper" bold color="text-01" textAlign="right" {...textProps}>
            {name}
          </Text>
        </TextButton>
      </a>
    </Link>
  );
};
