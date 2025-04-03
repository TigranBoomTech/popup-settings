import React, { useEffect, useState } from "react";
import {
  conditions,
  addressSubFields,
  nameSubFields,
  emailTypes,
  notificationEmailTypes,
} from "../../../helpers/conditional_mailing/options";
import {
  Box,
  Card,
  DatePicker,
  Dropdown,
  Input,
  SegmentedToggle,
  Text,
  TimeInput,
} from "@wix/design-system";
import classes from "./Condition.module.scss";
import { Add, Email, Inbox, Minus } from "@wix/wix-ui-icons-common";

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

  const handleEmailChange = (value) => {
    setSendEmail(value);
  };

  const handleToggle = (_, type) => {
    setToggleState(type);
  };

  const handleEmailTypeChange = (type) => {
    setSelectedEmailType(type);
  };

  const handleFormEmailChange = (value) => {
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
        <Box className={classes.nigga}>
          <Text>If </Text>
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
          <Text>field value </Text>
          <Dropdown
            className={classes.conditions_dropdown}
            placeholder="Select Condition"
            maxHeightPixels="200px"
            dropdownWidth="auto"
            minWidthPixels="200px"
            options={matchedConditions?.map((condition, index) => ({
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
              className={classes.date_picker}
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
            />
          ) : selectedField.type === "time" ? (
            <TimeInput
              className={classes.time_picker}
              step={60}
              value={
                fieldValue
                  ? (() => {
                      const [hours, minutes] = fieldValue
                        .split(":")
                        .map(Number);
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
          ) : selectedField.type === "checkbox" ? (
            selectedCondition === "checked" ||
            selectedCondition === "not Checked" ? (
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
            ) : selectedCondition === "checked more than" ? (
              <Dropdown
                className={classes.options_dropdown}
                placeholder="Select Amount"
                maxHeightPixels="200px"
                dropdownWidth="auto"
                minWidthPixels="200px"
                options={fieldOptions.map((option, index) => ({
                  id: index,
                  value: index,
                }))}
                selectedId={selectedSubField}
                onSelect={(option) => {
                  handleSubFieldChange(option.value);
                }}
              />
            ) : selectedCondition === "checked equal to" ? (
              <Dropdown
                className={classes.options_dropdown}
                placeholder="Select Amount"
                maxHeightPixels="200px"
                dropdownWidth="auto"
                minWidthPixels="200px"
                options={fieldOptions.map((option, index) => ({
                  id: index + 1,
                  value: index + 1,
                }))}
                selectedId={selectedSubField}
                onSelect={(option) => {
                  handleSubFieldChange(option.value);
                }}
              />
            ) : selectedCondition === "checked less than" ? (
              <Dropdown
                className={classes.options_dropdown}
                placeholder="Select Amount"
                maxHeightPixels="200px"
                dropdownWidth="auto"
                minWidthPixels="200px"
                options={fieldOptions.map((option, index) => ({
                  id: index + 2,
                  value: index + 2,
                }))}
                selectedId={selectedSubField}
                onSelect={(option) => {
                  handleSubFieldChange(option.value);
                }}
              />
            ) : null
          ) : selectedField.type === "price" ? (
            <>
              <Input
                className={classes.dollar_input}
                placeholder="Dollars"
                value={fieldValue.dollars}
                onClear={() =>
                  setFieldValue({
                    dollars: "0",
                    cents: fieldValue.cents,
                  })
                }
                onChange={(e) => {
                  !isNaN(Number(e.target.value))
                    ? setFieldValue({
                        dollars: e.target.value,
                        cents: fieldValue.cents,
                      })
                    : setFieldValue({
                        dollars: "0",
                        cents: fieldValue.cents,
                      });
                }}
              />
              <Input
                className={classes.cent_input}
                placeholder="Cents"
                value={fieldValue.cents}
                onClear={() =>
                  setFieldValue({
                    dollars: fieldValue.dollars,
                    cents: "0",
                  })
                }
                onChange={(e) => {
                  !isNaN(Number(e.target.value))
                    ? setFieldValue({
                        dollars: fieldValue.dollars,
                        cents: e.target.value,
                      })
                    : setFieldValue({
                        dollars: fieldValue.dollars,
                        cents: "0",
                      });
                }}
              />
            </>
          ) : (
            <Input
              className={classes.common_input}
              placeholder="John Doe"
              value={fieldValue}
              onClear={() => setFieldValue("")}
              onChange={(e) => {
                setFieldValue(e.target.value);
              }}
            />
          )}
          <Text>send </Text>
          {confirmationEmail ? (
            <Dropdown
              className={classes.email_type_dropdown}
              placeholder="Select Email Type"
              maxHeightPixels="200px"
              dropdownWidth="auto"
              minWidthPixels="200px"
              options={emailTypes.map((type, index) => ({
                id: type.value,
                value: type.label,
              }))}
              selectedId={selectedEmailType}
              onSelect={(option) => {
                handleEmailTypeChange(option.id);
              }}
            />
          ) : (
            <Text>Notification email </Text>
          )}
          <Text>to </Text>
          <Box className={classes.toggle_container}>
            <SegmentedToggle selected={toggleState} onClick={handleToggle}>
              <SegmentedToggle.Button
                prefixIcon={<Email />}
                value="custom_email"
              >
                Custom Email
              </SegmentedToggle.Button>
              <SegmentedToggle.Button
                prefixIcon={<Inbox />}
                value="form_emails"
              >
                Form Email
              </SegmentedToggle.Button>
            </SegmentedToggle>
          </Box>

          {toggleState === "custom_email" ? (
            <Input
              className={classes.common_input}
              placeholder="info@example.com"
              value={sendEmail}
              onClear={() => handleEmailChange("")}
              onChange={(e) => {
                handleEmailChange(e.target.value);
              }}
            />
          ) : null}

          {toggleState === "form_emails" ? (
            <Dropdown
              className={classes.form_emails_dropdown}
              placeholder="Select Form Email"
              maxHeightPixels="200px"
              dropdownWidth="auto"
              minWidthPixels="200px"
              options={emailFields.map((field, index) => ({
                id: index,
                value: field.label,
              }))}
              selectedId={emailFields.findIndex(
                (field) => field.id === formEmail
              )}
              onSelect={(option) => {
                handleFormEmailChange(option.id);
              }}
            />
          ) : null}

          <Add
            onClick={() => {
              addCondition();
            }}
          />
          <Minus
            onClick={() => {
              removeCondition(index);
            }}
          />
        </Box>
      </Card.Content>
    </Card>
  );
};

export default Condition;
