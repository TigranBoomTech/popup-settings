import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidations, getFieldWidth } from "../helpers";

export const time = ({ field, messages }) => {
    const { id, format } = field;
    const formatedField = {
        type: "time",
        id,
        format,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        width: getFieldWidth(field),
        validations: getFieldValidations(field, messages, true),
        ...getFieldLabel(field),
    };

    return formatedField;
};
