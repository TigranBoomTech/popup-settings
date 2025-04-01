import {
    getFieldClassnames,
    getFieldInitialState,
    getFieldInstruction,
    getFieldLabel,
    getFieldValidation,
    getFieldViewState,
    getFieldWidth,
} from "../helpers";

export const textarea = ({ field, messages }) => {
    const { id, placeholder, height, editor } = field;

    let formatedField = {
        id,
        height,
        placeholder,
        type: "textarea",
        richTextEditor: editor,
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
