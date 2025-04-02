import React, { useEffect, useState } from "react";
import {
  conditions,
  addressSubFields,
  nameSubFields,
  emailTypes,
  notificationEmailTypes,
} from "../../../helpers/conditional_mailing/options";
import {
  Card,
  DatePicker,
  Dropdown,
  Text,
  TimeInput,
} from "@wix/design-system";
import classes from "./Condition.module.scss";

const Condition = ({
  index,
  isLast,
  fields,
  condition,
  addCondition,
  removeCondition,
  updateCondition,
  conditionsLength,
  confirmationEmail,
}) => {
  const [fieldValue, setFieldValue] = useState(condition?.value);
  const [sendEmail, setSendEmail] = useState(condition?.email);

  // -----------------------------------------------------------

  const [toggleState, setToggleState] = useState(condition?.toggleState);
  const [selectedEmailType, setSelectedEmailType] = useState(
    condition?.emailType
  );
  const [emailFields, setEmailFields] = useState([]);
  const [formEmail, setFormEmail] = useState(condition?.formEmail);

  // -----------------------------------------------------------

  const [selectedField, setSelectedField] = useState({
    id: condition?.field,
    type: condition?.type,
  });

  const [fieldOptions, setFieldOptions] = useState([]);
  console.log(fieldOptions);
  const [selectedSubField, setSelectedSubField] = useState(condition?.subField);
  const [selectedCondition, setSelectedCondition] = useState(
    condition?.condition
  );
  const [matchedConditions, setMatchedConditions] = useState([]);

  useEffect(() => {
    if (selectedField.id) {
      const options =
        fields.find((field) => field.id === selectedField.id)?.options || [];
      setFieldOptions(options);
    }
    setEmailFields(fields.filter((field) => field.type === "email"));
  }, []);

  useEffect(() => {
    if (selectedSubField === "country") {
      setMatchedConditions(conditions.select);
    } else {
      setMatchedConditions(conditions[selectedField.type]);
    }
    console.log(selectedSubField);
  }, [selectedField.type, selectedSubField]);

  useEffect(() => {
    updateCondition(
      {
        field: selectedField.id,
        subField: selectedSubField || "",
        toggleState: toggleState,
        emailType: selectedEmailType || "",
        formEmail: formEmail,
        type: selectedField.type,
        email: sendEmail,
        value: fieldValue,
        condition: selectedCondition,
      },
      index
    );
  }, [
    selectedField,
    selectedSubField,
    sendEmail,
    fieldValue,
    selectedCondition,
    toggleState,
    selectedEmailType,
    formEmail,
  ]);

  const handleEmailChange = (e) => {
    setSendEmail(e.target.value);
  };

  const handleToggle = (type) => {
    setToggleState(type);
  };

  const handleEmailTypeChange = (e) => {
    setSelectedEmailType(e.target.value);
  };

  const handleFormEmailChange = (e) => {
    const value = e.target.value;
    const field = emailFields[value];
    const { id } = field;
    setFormEmail(id);
  };

  const handleFieldChange = (value) => {
    const field = fields[value];
    console.log(field);
    const { id, options = [], type } = field;

    let fieldType = type;

    if (type === "checkbox" && field.fieldName === "terms") {
      fieldType = "terms";
    }

    if (options) {
      setSelectedSubField("");
      setFieldOptions([]);
      setSelectedField({ id, options, type: fieldType });
    } else {
      setSelectedCondition({ id, type: fieldType });
    }
  };

  const handleSubFieldChange = (value) => {
    console.log(value);
    setSelectedSubField(value);
  };

  const handleConditionChange = (value) => {
    setSelectedCondition(value);
  };

  return (
    <Card>
      <Card.Content>
        <Text>If</Text>
        <Dropdown
          className={classes.fields_dropdown}
          placeholder="Select Field"
          maxHeightPixels="200px"
          dropdownWidth="auto"
          minWidthPixels="200px"
          options={fields.map((field, index) => ({
            id: index,
            value: field.label,
          }))}
          selectedId={fields.findIndex(
            (field) => field.id === selectedField?.id
          )}
          onSelect={(option) => {
            handleFieldChange(option.id);
          }}
        />
        {selectedField.type === "name" && (
          <Dropdown
            className={classes.fields_dropdown}
            placeholder="Select Name SubField"
            maxHeightPixels="200px"
            dropdownWidth="auto"
            minWidthPixels="200px"
            options={nameSubFields.map((subField, index) => ({
              id: subField.value,
              value: subField.label,
            }))}
            selectedId={selectedSubField}
            onSelect={(option) => {
              handleSubFieldChange(option.id);
            }}
          />
        )}
        {selectedField.type === "address" && (
          <Dropdown
            className={classes.fields_dropdown}
            placeholder="Select Address SubField"
            maxHeightPixels="200px"
            dropdownWidth="auto"
            minWidthPixels="200px"
            options={addressSubFields.map((subField, index) => ({
              id: subField.value,
              value: subField.label,
            }))}
            selectedId={selectedSubField}
            onSelect={(option) => {
              handleSubFieldChange(option.id);
            }}
          />
        )}
        <Text>field value</Text>
        <Dropdown
          className={classes.conditions_dropdown}
          placeholder="Select Condition"
          maxHeightPixels="200px"
          dropdownWidth="auto"
          minWidthPixels="200px"
          options={matchedConditions.map((condition, index) => ({
            id: condition,
            value: condition,
          }))}
          selectedId={selectedCondition}
          onSelect={(option) => {
            handleConditionChange(option.id);
          }}
        />

        {/* Checks */}

        {selectedField.type === "radio" || selectedField.type === "select" ? (
          <Dropdown
            className={classes.options_dropdown}
            placeholder="Select Option"
            maxHeightPixels="200px"
            dropdownWidth="auto"
            minWidthPixels="200px"
            options={fieldOptions.map((option, index) => ({
              id: option.name,
              value: option.name,
            }))}
            selectedId={selectedSubField}
            onSelect={(option) => {
              handleSubFieldChange(option.value);
            }}
          />
        ) : selectedField.type === "terms" ? null : selectedField.type ===
          "date" ? (
          <DatePicker
            value={fieldValue ? new Date(fieldValue) : null}
            onChange={(value) => {
              if (value) {
                const formattedValue =
                  value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : value;
                setFieldValue(formattedValue);
              }
            }}
            width="200px"
          />
        ) : selectedField.type === "time" ? (
          <TimeInput
            step={60}
            width="200px"
            value={
              fieldValue
                ? (() => {
                    const [hours, minutes] = fieldValue.split(":").map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes, 0, 0);
                    return date;
                  })()
                : null
            }    
            onChange={(value) => {
              const date = new Date(value.date);
              const hours = date.getHours().toString().padStart(2, "0");
              const minutes = date.getMinutes().toString().padStart(2, "0");
              const formattedTime = `${hours}:${minutes}`;
              setFieldValue(formattedTime);
            }}
          />
        ) : null}
      </Card.Content>
    </Card>
  );
};

export default Condition;
