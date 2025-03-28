import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation, getFieldWidth } from "../helpers";

export const select = ({ field, messages }) => {
    const { id, placeholder, options, quantity, quantityLabel, defQuantity, limit } = field;

    if (field.quantityLabel === undefined) {
        field.quantityLabel = "Quantity";
    }

    const formatedField = {
        type: "select",
        id,
        options: [],
        payable: 1,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        validation: getFieldValidation(field, messages),
        width: getFieldWidth(field),
        limit: limit,
        ...getFieldLabel(field),
    };

    if (placeholder !== "" && placeholder !== undefined)
        formatedField.options.push({
            key: "placeholder",
            value: placeholder,
        });

    let checkedKey = null;
    let checkedName = null;

    // eslint-disable-next-line array-callback-return
    options.map((option, key) => {
        if (option.other) {
            formatedField.options.push({
                key: "other",
                value: option.name,
                isNumber: option.price,
                limit: option.limit,
                count: option.count,
            });
        } else {
            formatedField.options.push({
                key,
                value: option.name,
                label: option.name,
                price: option.price,
                limit: option.limit,
                count: option.count,
            });
        }

        if (option.checked) checkedKey = key;
        if (option.checked) checkedName = option.name;
    });

    if (quantity)
        formatedField.quantity = {
            enabled: true,
            label: quantityLabel,
            value: defQuantity,
        };

    if (typeof checkedKey !== undefined) formatedField.initial = checkedKey;
    if (checkedName === "Other") formatedField.initial = "other";

    return formatedField;
};
