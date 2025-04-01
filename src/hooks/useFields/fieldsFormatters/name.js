import {
    getFieldClassnames,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidations,
    getFieldViewState,
    getFieldInitialState,
    getFieldWidth,
} from "../helpers";

export const name = ({ field, messages }) => {
    const { id, placeholder, middleName } = field;

    const formatedPlaceholders = {};

    Object.keys(placeholder).forEach(key => {
        const newPlaceholder = placeholder[key] || "";
        formatedPlaceholders[key] = newPlaceholder;
    });

    const formatedField = {
        id,
        middleName,
        type: "name",
        width: getFieldWidth(field),
        readOnly: getFieldViewState(field),
        initials: getFieldInitialState(field, true),
        placeholders: formatedPlaceholders,
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validations: getFieldValidations(field, messages),
        ...getFieldLabel(field),
    };

    return formatedField;
};
