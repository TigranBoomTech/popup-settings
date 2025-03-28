import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const website = ({ field, messages }) => {
    const { id, placeholder } = field;

    const formatedField = {
        id,
        type: "url",
        placeholder,
        width: getFieldWidth(field),
        readOnly: getFieldViewState(field),
        initial: getFieldInitialState(field),
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validation: getFieldValidation(field, messages, true),
        ...getFieldLabel(field),
    };

    return formatedField;
};
