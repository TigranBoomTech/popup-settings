import { useCallback, useMemo, useRef, useState } from "react";
import { convertField, getBuilderData, isEmptyObject } from "./helpers";

function useFields({ fields, premium }) {
    const fieldsInfoRef = useRef({});

    const fieldsData = useMemo(() => {
        if (isEmptyObject(fields)) return [];
        return getBuilderData(fields, fieldsInfoRef.current, premium);
    }, [fields, premium]);

    const [stateFields, setFields] = useState(fieldsData);
    /**
     * Use this function to add field
     * @param {object} fieldData field data object
     * @param {boolean} shouldConvert optional param , use it if you have to use fieldFormatter function
     */
    const addField = useCallback((fieldData, shouldConvert = false) => {
        setFields(prevFields => {
            if (!fieldData) return prevFields;
            const field = shouldConvert ? convertField(fieldData) : fieldData;
            const newFields = [...prevFields, field];
            return newFields;
        });
    }, []);

    /**
     * Use this function to modify existing field
     * @param {string} id id of modifying field
     * @param {object} fieldData field data object
     * @param {boolean} shouldConvert optional param , use it if you have to use fieldFormatter function
     */
    const modifyField = (id, fieldData, shouldConvert = false) => {
        const existFieldIndex = stateFields.findIndex(({ id: fieldId }) => fieldId === id);
        if (existFieldIndex >= 0) {
            const field = shouldConvert ? convertField(fieldData) : fieldData;
            setFields(prev => {
                const newFields = [...prev];
                newFields[existFieldIndex] = field;
                return newFields;
            });
        } else {
            console.log("there isn't such a field", id);
        }
    };

    /**
     * Batch update fields, can be used to update many fields at once
     * @param {object} updateData Object with field id as key and fieldData as value
     * @param {function} callBack Optional callback function to manipulate each field
     */
    const batchUpdateFields = useCallback((updateData, callBack) => {
        setFields(prevFields => {
            const newData = prevFields.map((prevData, index) => {
                const existFieldData = callBack ? callBack(prevData) : updateData[prevData.id];
                fieldsInfoRef.current[prevData.id] = index;
                return existFieldData || prevData;
            });
            return newData;
        });
    }, []);

    return { fields: stateFields, modifyField, batchUpdateFields, addField };
}

export default useFields;
