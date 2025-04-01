import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const singleLineText = ({ field, messages }) => {
    const { id, placeholder } = field;

    const formatedField = {
        id,
        placeholder,
        type: "text",
        width: getFieldWidth(field),
        readOnly: getFieldViewState(field),
        initial: getFieldInitialState(field),
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validation: getFieldValidation(field, messages),
        ...getFieldLabel(field),
    };

    return formatedField;
};
