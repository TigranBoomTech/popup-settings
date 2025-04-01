import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation, getFieldWidth } from "../helpers";

export const password = ({ field, messages }) => {
    const { id, placeholder } = field;

    const formatedField = {
        type: "password",
        id,
        placeholder,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        validation: getFieldValidation(field, messages),
        width: getFieldWidth(field),
        ...getFieldLabel(field),
    };

    return formatedField;
};
