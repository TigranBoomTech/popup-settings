import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidations,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const price = ({ field, paymentSettings, messages }) => {
    const { id, placeholder, payable, isDecimal = false } = field;
    const currency = "$";

    const formatedField = {
        id,
        isDecimal: !isDecimal,
        type: "price",
        placeholders: placeholder,
        width: getFieldWidth(field),
        currency: currency,
        payable: payable ? "collect" : 0,
        readOnly: getFieldViewState(field),
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        initials: getFieldInitialState(field, true),
        validations: getFieldValidations(field, messages),
        ...getFieldLabel(field),
    };
    return formatedField;
};
