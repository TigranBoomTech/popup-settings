import React from "react";
import { getFieldClassnames, getFieldInstruction } from "../helpers";

export const customHTML = ({ field }) => {
    const { id, value } = field;
    const formatedField = {
        type: "just",
        id,
        value,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        Component: () => {
            return <div dangerouslySetInnerHTML={{ __html: value.value }}></div>;
        },
    };
    return formatedField;
};
