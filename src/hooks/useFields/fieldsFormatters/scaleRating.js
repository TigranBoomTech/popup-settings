import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation, getFieldWidth } from "../helpers";

export const scaleRating = ({ field: fieldData, messages }) => {
    const { id, max, count, postfix, prefix, value, ...field } = fieldData;

    const formatedField = {
        type: "scaleRating",
        id,
        min: parseInt(count),
        max: parseInt(max),
        postFix: postfix,
        preFix: prefix,
        initial: parseInt(value),
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        validation: getFieldValidation(field, messages),
        width: getFieldWidth(field),
        ...getFieldLabel(field, true),
    };

    return formatedField;
};
