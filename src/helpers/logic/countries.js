import { listItemSelectBuilder } from "@wix/design-system";
import { countryList } from "../../hooks/useFields/countries";

const country_list = countryList.map((country) =>
  listItemSelectBuilder({
    id: country.key,
    title: country.value,
    label: country.value,
  })
);

export default country_list;
