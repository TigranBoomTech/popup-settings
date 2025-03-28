import { countryList } from "./../countries";
import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidations,
    getFieldWidth,
    getHiddenInputs,
} from "../helpers";

export const address = ({ field, messages }) => {
    const { id, placeholder, value } = field;

    const formatedPlaceholders = {};

    placeholder &&
        Object.keys(placeholder).forEach(key => {
            const newKey = key === "zipcode" ? "zip" : key === "region" ? "state" : key;

            const newPlaceholder = placeholder[key] || "";

            formatedPlaceholders[newKey] = newPlaceholder;
        });

    const formatedField = {
        type: "address",
        id,
        placeholders: formatedPlaceholders,
        defaultCountry: 229,
        initials: getFieldInitialState(field, true),
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        width: getFieldWidth(field),
        hide: getHiddenInputs(field),
        validations: getFieldValidations(field, messages),
        ...getFieldLabel(field),
    };

    if (value.country !== "") {
        const [countryId] = countryList.filter(item => item.value === value.country);
        if (countryId) formatedField.defaultCountry = countryId.key;
        else
            formatedField.placeholders = {
                ...formatedField.placeholders,
                country: value.country,
            };
    } else {
        const [countryId] = countryList.filter(item => item.value === "US" || "");
        if (countryId) formatedField.defaultCountry = countryId.key;
    }

    return formatedField;
};
