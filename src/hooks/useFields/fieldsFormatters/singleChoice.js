import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation, getFieldWidth } from "../helpers";

export const singleChoice = ({ field, messages }) => {
    const { id, options, quantity, quantityLabel, defQuantity, columns, limit } = field;

    if (field.quantityLabel === undefined) {
        field.quantityLabel = "Quantity";
    }

    const formatedField = {
        type: "singleChoice",
        id,
        columns,
        options: [],
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        width: getFieldWidth(field),
        validation: getFieldValidation(field, messages),
        limit: limit,
        ...getFieldLabel(field, true),
    };

    if (options) {
        // eslint-disable-next-line array-callback-return
        options.map((option, key) => {
            if (option.other) {
                formatedField.options.push({
                    key: "other",
                    value: "other",
                    isNumber: option.price,
                    label: option.name,
                    placeholder: option.name,
                    price: option.price,
                    checked: option.checked,
                    limit: option.limit,
                    count: option.count,
                });
            } else {
                formatedField.options.push({
                    key,
                    value: `${key}`,
                    label: option.name,
                    price: option.price,
                    checked: option.checked,
                    limit: option.limit,
                    count: option.count,
                });
            }
        });
    }
    if (quantity)
        formatedField.quantity = {
            enabled: true,
            label: quantityLabel,
            value: defQuantity,
        };

    return formatedField;
};
