import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const email = ({ field, messages }) => {
    const { id, placeholder } = field;

    const formatedField = {
        type: "email",
        id,
        placeholder,
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
