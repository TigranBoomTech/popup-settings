import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const number = ({ field, messages }) => {
    const { id, placeholder, payable } = field;

    const formatedField = {
        id,
        placeholder,
        type: "number",
        width: getFieldWidth(field),
        payable: payable ? "collect" : 0,
        readOnly: getFieldViewState(field),
        initial: getFieldInitialState(field),
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validation: getFieldValidation(field, messages, true),
        ...getFieldLabel(field),
    };
    return formatedField;
};
