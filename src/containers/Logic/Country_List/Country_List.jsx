import React, { useState } from "react";
import country_list from "../../../helpers/logic/countries";
import { AutoComplete } from "@wix/design-system";

const CountriesList = ({ saveStatement }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedId, setSelectedId] = useState();

  function includesCaseInsensitive(a = "", b = "") {
    return !b || a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
  }

  return (
    <AutoComplete
      placeholder="Select a country"
      options={country_list}
      selectedId={selectedId}
      value={searchValue}
      onSelect={(country) => {
        setSelectedId(country.id);
        setSearchValue(country.label);
        saveStatement(country.label);
      }}
      onChange={(event) => setSearchValue(event.target.value)}
      predicate={(option) =>
        includesCaseInsensitive(option.label, searchValue.trim())
      }
    />
  );
};

export default CountriesList;
