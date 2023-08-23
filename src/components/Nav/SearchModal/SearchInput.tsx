import { ChangeEvent, useMemo, useState } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { SearchBoxProvided } from "react-instantsearch-core";
import { useTranslation } from "next-i18next";
import debounce from "lodash/debounce";
import { TextInput } from "uikit";

const SEARCH_DELAY = 300; // ms

const SearchInput: React.FC<SearchBoxProvided> = ({ refine, currentRefinement }) => {
  const { t } = useTranslation();

  // algolia recommended debounce. set value instantly, but call refine later
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/react/#debouncing
  const [value, setValue] = useState(currentRefinement);

  const debouncedRefine = useMemo(() => {
    return debounce(
      (query) => {
        refine(query);
      },
      SEARCH_DELAY,
      { leading: false, trailing: true }
    );
  }, [refine]);

  const onChangeDebounced = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedRefine(event.currentTarget.value);
    setValue(event.currentTarget.value);
  };

  return (
    <TextInput
      wrapperProps={{ width: "100%" }}
      id="algolia_search"
      type="search"
      placeholder={t("Collections, Items, Profiles")}
      onChange={onChangeDebounced}
      onClear={() => {
        setValue("");
        refine("");
      }}
      value={value}
      sx={{
        "::-webkit-search-cancel-button": {
          display: "none",
        },
      }}
    />
  );
};

export default connectSearchBox(SearchInput);
