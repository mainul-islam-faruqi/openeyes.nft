import { createContext, useReducer } from "react";
import { EventFilter, EventType } from "types/graphql";

export interface ActivityFilterContextReturn {
  filters: EventFilter;
  toggleFilterType: (eventType: EventType) => void;
  resetFilters: () => void;
}

export const ActivityFilterContext = createContext<ActivityFilterContextReturn | undefined>(undefined);

export interface FilterProviderProps {
  defaultFilters?: EventFilter;
}

export type Actions = { type: "toggleFilterType"; data: EventType } | { type: "resetFilter"; data: EventFilter };

const reducer = (state: EventFilter, action: Actions) => {
  switch (action.type) {
    case "resetFilter":
      return action.data;
    case "toggleFilterType":
      if (state.type === undefined) {
        return {
          ...state,
          type: [action.data],
        };
      }

      const isRemovingType = state.type.includes(action.data);

      // Remove type completely if we are toggling the last filter off
      if (isRemovingType && state.type.length === 1) {
        return {
          ...state,
          type: undefined,
        };
      }

      return {
        ...state,
        type: isRemovingType
          ? state.type.filter((prevFiltersType) => prevFiltersType !== action.data)
          : [...state.type, action.data],
      };
    default:
      return state;
  }
};

export const ActivityFilterProvider: React.FC<FilterProviderProps> = ({ children, defaultFilters = {} }) => {
  const [state, dispatch] = useReducer(reducer, defaultFilters);

  const toggleFilterType = (eventType: EventType) => {
    dispatch({ type: "toggleFilterType", data: eventType });
  };
  const resetFilters = () => dispatch({ type: "resetFilter", data: defaultFilters });

  return (
    <ActivityFilterContext.Provider value={{ filters: state, toggleFilterType, resetFilters }}>
      {children}
    </ActivityFilterContext.Provider>
  );
};
