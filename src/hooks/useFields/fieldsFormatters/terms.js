import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldValidation } from "../helpers";

export const terms = ({ field, messages }) => {
    const { id, options, termsURL, openLinkIn } = field;
    const [text] = options;
    const { name, checked } = text;
    const formatedField = {
        type: "terms",
        id,
        openIn: openLinkIn,
        text: name,
        url: termsURL,
        initial: checked,
        payable: "distribute",
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        validation: getFieldValidation(field, messages),
        ...getFieldLabel(field, true),
    };

    return formatedField;
};
