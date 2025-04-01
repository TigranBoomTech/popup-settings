import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation } from "../helpers";

export const starRating = ({ field: fieldData, messages }) => {
    const { max, id, color, zoom, shape, area, value, ...field } = fieldData;
    const formatedField = {
        type: "starRating",
        id,
        color,
        zoom,
        shape,
        area,
        count: max,
        initial: value ? parseInt(value) : undefined,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        validation: getFieldValidation(field, messages),
        ...getFieldLabel(field),
    };

    return formatedField;
};
