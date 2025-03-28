import { address } from "./fieldsFormatters/address";
import { customHTML } from "./fieldsFormatters/customHTML";
import { date } from "./fieldsFormatters/date";
import { email } from "./fieldsFormatters/email";
import { file } from "./fieldsFormatters/file";
import { map } from "./fieldsFormatters/map";
import { multipleChoice } from "./fieldsFormatters/multipleChoice";
import { name } from "./fieldsFormatters/name";
import { number } from "./fieldsFormatters/number";
import { password } from "./fieldsFormatters/password";
import { phone } from "./fieldsFormatters/phone";
import { price } from "./fieldsFormatters/price";
import { scaleRating } from "./fieldsFormatters/scaleRating";
import { select } from "./fieldsFormatters/select";
import { signature } from "./fieldsFormatters/signature";
import { singleChoice } from "./fieldsFormatters/singleChoice";
import { singleLineText } from "./fieldsFormatters/singleLineText";
import { starRating } from "./fieldsFormatters/starRating";
import { terms } from "./fieldsFormatters/terms";
import { textarea } from "./fieldsFormatters/textarea";
import { time } from "./fieldsFormatters/time";
import { website } from "./fieldsFormatters/website";

export function trueChecker(value) {
    return value === true || value === "1" || value === 1;
}

export function getBuilderData(fields = [], fieldsInfo, premium) {
    if (fields && fields.length === 0) return [];
    let formatedFields = [];
    // eslint-disable-next-line array-callback-return
    fields.map((field, index) => {
        const { type, id } = field;
        if ((type === "signature" || type === "file" || type === "password") && !premium) {
            // eslint-disable-next-line array-callback-return
            return;
        }

        fieldsInfo[String(id)] = index;
        switch (type) {
            case "text":
                formatedFields.push(
                    singleLineText({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "name":
                formatedFields.push(
                    name({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "address":
                formatedFields.push(
                    address({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "email":
                formatedFields.push(
                    email({
                        field,
                        messages: {
                            msg_required: "This field is required",
                            msg_email: "Please enter valid email",
                        },
                    }),
                );
                break;
            case "website":
                formatedFields.push(
                    website({
                        field,
                        messages: {
                            msg_required: "This field is required",
                            msg_url: "Please enter valid url",
                        },
                    }),
                );
                break;
            case "time":
                formatedFields.push(
                    time({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "password":
                formatedFields.push(
                    password({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "customHTML":
                formatedFields.push(
                    customHTML({
                        field,
                    }),
                );
                break;
            case "textarea":
                formatedFields.push(
                    textarea({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "select":
                formatedFields.push(
                    select({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "number":
                formatedFields.push(
                    number({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "price":
                formatedFields.push(
                    price({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "map":
                formatedFields.push(
                    map({
                        field,
                    }),
                );
                break;

            case "radio":
                formatedFields.push(
                    singleChoice({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "checkbox":
                const { fieldName } = field;
                if (fieldName === "terms") {
                    formatedFields.push(
                        terms({
                            field,
                            messages: {
                                msg_required: "This field is required",
                            },
                        }),
                    );
                } else {
                    formatedFields.push(
                        multipleChoice({
                            field,
                            messages: {
                                msg_required: "This field is required",
                            },
                        }),
                    );
                }
                break;
            case "file":
                formatedFields.push(
                    file({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "date":
            case "date2":
                formatedFields.push(
                    date({
                        field,
                        messages: {
                            msg_required: "This field is required",
                            msg_date: "Please enter valid date",
                        },
                    }),
                );
                break;
            case "phone":
                formatedFields.push(
                    phone({
                        field,
                        messages: {
                            msg_required: "This field is required",
                            msg_number: "Please enter phone number in correct form",
                        },
                    }),
                );
                break;
            case "scalerating":
                formatedFields.push(
                    scaleRating({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;

            case "starrating":
                formatedFields.push(
                    starRating({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            case "signature":
                formatedFields.push(
                    signature({
                        field,
                        messages: {
                            msg_required: "This field is required",
                        },
                    }),
                );
                break;
            default:
                break;
        }
    });
    return formatedFields;
}

export function convertField(fieldData) {
    const data = getBuilderData([fieldData], {}, {}, {}, {});
    return data[0];
}

export function getFieldClassnames(field) {
    //for now here is checking shrink and subinputs required  , if needed add everything here
    //just remember that this is common function , using everywhere
    const { shrink, hidelabel, label, required, fieldState } = field;
    const shouldAddRequired = (trueChecker(hidelabel) || label === "") && trueChecker(required);

    const classnames = [];

    switch (shrink) {
        case "halfWidth":
            classnames.push("half");
            break;
        case "1/3":
            classnames.push("one-third");
            break;
        case "1/4":
            classnames.push("one-fourth");
            break;
        case "fullWidth_Label":
            classnames.push("full-withoutLabel");
            break;
        default:
            break;
    }
    if (shouldAddRequired) {
        // can be problems with not sub inputs
        classnames.push("subinputs_asterisks");
    }
    if (fieldState === "hide") {
        classnames.push("hidden");
    }

    return classnames.length ? classnames : undefined; // for prefixes returning classnames or undefined cause in builder there is check for classname existing , if we pass empty array it will assign empty string as a prefix.
}

export function getFieldInstruction(field) {
    const { instr } = field;
    return instr || undefined;
}
export function getFieldWidth(field) {
    const { width } = field;
    return width || undefined;
}

export function getFieldLabel(field, asterisk0, isSubInput) {
    //only this function returns not value
    //it returns object with label or postfix , cause based on field labrel and required it should be postfix or label
    const { hidelabel, label = "", required } = field;
    if (!(trueChecker(hidelabel) || label === "")) {
        let data = trueChecker(required) ? `${label} <span class='boomForm-field__label-star'>*</span>` : label;
        return {
            label: data,
        };
    } else if (required) {
        if (isSubInput) return {};
        //smt like isSubInput , return empty {}
        return {
            postfix: `<span class='asterisk ${asterisk0 && "asterisk0"}'>*</span>`,
        };
    }
}

export function getFieldValidation(field, messages, useExternal) {
    //this function we use for fields that dont have sub inputs
    //for example text , number , email , date and etc...
    const { required } = field;
    if (useExternal) return getExternalValidation(field, messages);
    const validation = {
        HTMLValidate: true,
    };
    if (trueChecker(required)) {
        validation.required = { msg: "Field is required" };
    }
    return validation;
}

export function getFieldValidations(field, messages) {
    const { type, required } = field;
    const { msg_required } = messages;
    const fieldInputs = getSubInputs(type);
    const validations = {};
    const validation = {
        HTMLValidate: true,
    };
    if (trueChecker(required)) {
        validation["required"] = { msg: msg_required };
    }

    // eslint-disable-next-line array-callback-return
    fieldInputs.map(subInput => {
        validations[subInput] = validation;
    });
    return validations;
}

export function getHiddenInputs(field) {
    const hide = [];
    const subinputs = getSubInputs(field.type);

    // eslint-disable-next-line array-callback-return
    subinputs.map(input => {
        if (trueChecker(field["hide" + input])) {
            hide.push(input);
        }
    });
    return hide;
}

function getSubInputs(fieldType) {
    switch (fieldType) {
        case "name": {
            return ["first", "last"];
        }
        case "address": {
            return ["street", "street2", "city", "state", "zip", "country"];
        }
        case "time": {
            return ["hour", "minute"];
        }
        case "price": {
            return ["first", "last"];
        }
        default: {
            break;
        }
    }
}

function getExternalValidation(field, messages) {
    const { type, required, min, max, format, payable } = field;
    const {
        msg_required,
        msg_range,
        msg_minchar,
        msg_url,
        msg_email,
        msg_date,
        msg_maxchar,
        msg_number,
        msg_maxword,
        msg_minword,
    } = messages;
    const validation = { HTMLValidate: true };

    if (trueChecker(required)) {
        validation.required = { msg: msg_required };
    }
    switch (type) {
        case "number": {
            if (payable) {
                validation.regEx = {
                    msg: "Only positive digits allowed",
                    value: "^[0-9]*$",
                };
            }
            if (min || max) {
                const newFormat = format === "number" ? "number" : "length";
                min &&
                    (validation.min = {
                        msg: newFormat === "number" ? msg_range : msg_minchar,
                        value: parseInt(min),
                        type: newFormat,
                    });
                max &&
                    (validation.max = {
                        msg: newFormat === "number" ? msg_range : msg_minchar,
                        value: parseInt(max),
                        type: newFormat,
                    });

                if (min && min !== "" && max && max !== "") {
                    validation.min.msg = msg_range;
                    validation.max.msg = msg_range;
                }
            }
            break;
        }
        case "phone": {
            validation.regEx = {
                msg: msg_number,
                value: "^([0-9- ^*()+]{2,}|)$",
            };
            break;
        }
        case "date": {
            if (min !== undefined && min !== "")
                validation.min = {
                    msg: msg_date,
                    value: convertNumToDate(min, "min"),
                };
            if (max !== undefined && max !== "")
                validation.max = {
                    msg: msg_date,
                    value: convertNumToDate(max, "max"),
                };
            break;
        }
        case "website": {
            validation.url = { msg: msg_url };
            break;
        }
        case "email": {
            const { checkBusiness } = field;
            validation.email = { msg: msg_email };
            if (checkBusiness) {
                validation.regEx = {
                    msg: "Business emails only, common providers like Gmail, Yahoo, etc., are not allowed.",
                    value: "^[a-zA-Z0-9._%+-]+@(?!yahoo.com|hotmail.com|outlook.com|aol.com|icloud.com|protonmail.com|mail.com|zoho.com|live.com|msn.com|ymail.com|gmx.com|fastmail.com|mail.ru|bk.ru|gmail.com)[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
                };
            }
            break;
        }
        case "password": {
            const { lowercase, uppercase, number, symbol } = field;
            if (min || max) {
                const newFormat = format === "word";
                min &&
                    (validation.min = {
                        msg: newFormat ? msg_minword : msg_minchar,
                        value: parseInt(min),
                        type: newFormat ? "word" : "length",
                    });
                max &&
                    (validation.max = {
                        msg: newFormat ? msg_maxword : msg_maxchar,
                        value: parseInt(max),
                        type: newFormat ? "word" : "length",
                    });

                if (min && min !== "" && max && max !== "") {
                    validation.min.msg = msg_range;
                    validation.max.msg = msg_range;
                }
            }
            if (lowercase?.enabled && lowercase?.value && lowercase?.msg) {
                validation.lowercase = {
                    msg: lowercase.msg,
                    value: parseInt(lowercase.value),
                };
            }
            if (uppercase?.enabled && uppercase?.value && uppercase?.msg) {
                validation.uppercase = {
                    msg: uppercase.msg,
                    value: parseInt(uppercase.value),
                };
            }
            if (number?.enabled && number?.value && number?.msg) {
                validation.number = {
                    msg: number.msg,
                    value: parseInt(number.value),
                };
            }
            if (symbol?.enabled && symbol?.value && symbol?.msg) {
                validation.symbol = {
                    msg: symbol.msg,
                    value: parseInt(symbol.value),
                };
            }
            break;
        }
        default: {
            break;
        }
    }
    return validation;
}

function convertNumToDate(num, type) {
    const today = new Date();
    if (type === "min") today.setDate(today.getDate() - parseInt(num));
    else if (type === "max") today.setDate(today.getDate() + parseInt(num));
    return today.toISOString().slice(0, 10);
}

export function getFieldViewState(field) {
    const { fieldState } = field;
    if (fieldState === "readonly") return true;
    return false;
}

export function getFieldInitialState(field, useExternal = false) {
    // THIS FUNCTION RETURNS INITIAL VALUE OR UNDEFINED
    // YOU CAN USE useExternal PROPERTY FOR MULTI INPUTS FIELDS
    if (field?.prefill) {
        if (field.prefill.mode === "defaultValue") {
            if (useExternal) return getExternalInitialState(field);
            return field?.prefill?.defaultValue?.value || "";
        }
    }
    return;
}

export function isEmptyObject(obj = {}) {
    try {
        return Object.keys(obj).length === 0;
    } catch (e) {
        return true;
    }
}

function getExternalInitialState(field) {
    //FILL SWITCH BELLOW FOR MORE FIELDS
    //TO KNOW WHAT DATA TO RETURN SEE BOOMFORM BUILDER DOCS
    switch (field.type) {
        case "price": {
            return {
                first: field.prefill.defaultValue.first,
            };
        }
        case "name": {
            return {
                first: field.prefill.defaultValue.first,
                last: field.prefill.defaultValue.last,
            };
        }
        case "address": {
            return {
                city: field.prefill.defaultValue.city,
                state: field.prefill.defaultValue.state,
                street: field.prefill.defaultValue.street,
                street2: field.prefill.defaultValue.street2,
                zip: field.prefill.defaultValue.zip,
            };
        }
        default: {
            break;
        }
    }
}
