import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation } from "../helpers";

export const signature = ({ field, messages }) => {
    const { id } = field;

    const formatedField = {
        id,
        type: "signature",
        instruction: getFieldInstruction(field),
        classnameprefix: getFieldClassnames(field),
        validation: getFieldValidation(field, messages),
        clearBtnContent: field.clearBtnContent || "Clear",
        ...getFieldLabel(field),
    };

    return formatedField;
};
