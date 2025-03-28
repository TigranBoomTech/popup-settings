import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const phone = ({ field, messages }) => {
    const { id, placeholder } = field;

    const formatedField = {
        id,
        placeholder,
        type: "phone",
        width: getFieldWidth(field),
        readOnly: getFieldViewState(field),
        initial: getFieldInitialState(field),
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validation: getFieldValidation(field, messages),
        defaultCountryCode: "US",
        ...getFieldLabel(field),
    };

    return formatedField;
};
