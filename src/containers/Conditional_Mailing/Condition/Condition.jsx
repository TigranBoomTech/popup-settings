import React, { useEffect, useState } from "react";
import {
  conditions,
  addressSubFields,
  nameSubFields,
} from "../../../helpers/conditional_mailing/options";

import {
  Box,
  Card,
  DatePicker,
  Dropdown,
  IconButton,
  Input,
  listItemSelectBuilder,
  PopoverMenu,
  Text,
  TimeInput,
} from "@wix/design-system";
import {
  Condition as ConditionIcon,
  Input as InputIcon,
  Email,
  More,
  WixForms,
  QuickFormat,
  Delete,
  Notification,
  Confirm,
} from "@wix/wix-ui-icons-common";
import classes from "./Condition.module.scss";

const Condition = ({
  index,
  fields,
  condition,
  removeCondition,
  updateCondition,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleToggle = (type) => {
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
    const { id, options = [], type } = field;

    let fieldType = type;

    if (type === "checkbox" && field.fieldName === "terms") {
      fieldType = "terms";
    }

    if (options) {
      setSelectedSubField("");
      setFieldOptions(options);
      setSelectedField({ id, options, type: fieldType });
    } else {
      setSelectedCondition({ id, type: fieldType });
    }
  };

  const handleSubFieldChange = (value) => {
    setSelectedSubField(value);
  };

  const handleConditionChange = (value) => {
    setSelectedCondition(value);
  };

  const toOptions = [
    listItemSelectBuilder({
      id: "custom_email",
      title: "Custom Email",
      label: "Custom Email",
      prefix: (
        <Box>
          <Email />
        </Box>
      ),
    }),
    listItemSelectBuilder({
      id: "form_emails",
      title: "Form Email",
      label: "Form Email",
      prefix: (
        <Box>
          <WixForms />
        </Box>
      ),
    }),
  ];

  const sendOptions = [
    listItemSelectBuilder({
      id: "notification_email",
      title: "Notification email",
      label: "Notification email",
      prefix: (
        <Box>
          <Notification />
        </Box>
      ),
    }),
    listItemSelectBuilder({
      id: "confirmation_email",
      title: "Confirmation email",
      label: "Confirmation email",
      prefix: (
        <Box>
          <Confirm />
        </Box>
      ),
    }),
  ];

  return (
    <Card>
      <Card.Header
        title={`Condition ${index + 1}`}
        suffix={
          <PopoverMenu
            triggerElement={
              <IconButton priority="secondary">
                <More />
              </IconButton>
            }
          >
            <PopoverMenu.MenuItem
              skin="destructive"
              text="Delete"
              prefixIcon={<Delete />}
              onClick={() => removeCondition(index)}
            />
          </PopoverMenu>
        }
      />
      <Card.Divider />
      <Card.Content>
        <Box className={classes.condition} direction="vertical" gap="8px">
          <Text>IF</Text>

          <Dropdown
            className={classes.fields_dropdown}
            prefix={
              <Input.Affix>
                <WixForms />
              </Input.Affix>
            }
            placeholder="Select Field"
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
              prefix={
                <Input.Affix>
                  <QuickFormat />
                </Input.Affix>
              }
              placeholder="Select Name SubField"
              options={nameSubFields.map((subField) => ({
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
              prefix={
                <Input.Affix>
                  <QuickFormat />
                </Input.Affix>
              }
              placeholder="Select Address SubField"
              options={addressSubFields.map((subField) => ({
                id: subField.value,
                value: subField.label,
              }))}
              selectedId={selectedSubField}
              onSelect={(option) => {
                handleSubFieldChange(option.id);
              }}
            />
          )}
          {/* <Text>field value </Text> */}
          <Dropdown
            className={classes.conditions_dropdown}
            prefix={
              <Input.Affix>
                <ConditionIcon />
              </Input.Affix>
            }
            placeholder="Select Condition"
            options={matchedConditions?.map((condition) => ({
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
              options={fieldOptions.map((option) => ({
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
              prefix={
                <Input.Affix>
                  <Time />
                </Input.Affix>
              }
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
                options={fieldOptions.map((option) => ({
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
              prefix={
                <Input.Affix>
                  <InputIcon />
                </Input.Affix>
              }
              placeholder="Input Value"
              value={fieldValue}
              onClear={() => setFieldValue("")}
              onChange={(e) => {
                setFieldValue(e.target.value);
              }}
            />
          )}
          <Text> SEND </Text>
          {confirmationEmail ? (
            <Dropdown
              className={classes.email_type_dropdown}
              placeholder="Select Email Type"
              valueParser={(option) => option.label}
              options={sendOptions}
              selectedId={selectedEmailType}
              onSelect={(option) => {
                handleEmailTypeChange(option.id);
              }}
            />
          ) : (
            <Text>Notification email </Text>
          )}

          <Text>TO : </Text>
          <Dropdown
            className={classes.toggle_dropdown}
            placeholder="Select Email Type"
            valueParser={(option) => option.label}
            options={toOptions}
            selectedId={toggleState}
            onSelect={(option) => handleToggle(option.id)}
          />

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

          {emailFields.length > 0 && toggleState === "form_emails" ? (
            <Dropdown
              className={classes.form_emails_dropdown}
              placeholder="Select Form Email"
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
          ) : toggleState === "form_emails" ? (
            <Text size="medium" skin="error">
              Current you do not have email fields on your form
            </Text>
          ) : null}
        </Box>
      </Card.Content>
    </Card>
  );
};

export default Condition;
