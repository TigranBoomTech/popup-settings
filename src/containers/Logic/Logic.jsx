import React, { useState, useEffect } from "react";
import axios from "axios";
import conditions_names from "../../helpers/logic/conditions_names";
import { getParameterByName, headers, user_url } from "../../helpers/common";

import {
  AddItem,
  Box,
  Cell,
  EmptyState,
  Layout,
  ListItemSelect,
  Loader,
  Page,
  Text,
  TextButton,
  ToggleSwitch,
} from "@wix/design-system";

import classes from "./Logic.module.scss";
import { Add } from "@wix/wix-ui-icons-common";
import {
  checkboxRules,
  defaultRules,
  fileRules,
  inputRules,
  ratingRules,
  selectRules,
} from "../../helpers/logic/rules";
import { nanoid } from "nanoid";
import Statement from "./Statement/Statement";

const Logic = () => {
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState();
  const [logicStatements, setLogicStatements] = useState([]);

  const [excludeHiddenFields, setExcludeHiddenFields] = useState(false);
  const [newCondition, setNewCondition] = useState(null);

  useEffect(() => {
    axios.get(user_url, headers).then((response) => {
      const data = response.data;
      setFormFields(data.fields);

      const logicAddonValue = data.addons.find(
        (addon) => addon.name === "Logic"
      ).value;

      setExcludeHiddenFields(logicAddonValue?.excludeHiddenFields);

      const patchedConditions = logicAddonValue?.conditions?.map((item) => ({
        ...item,
        id: item.id || nanoid(),
      }));

      setLogicStatements(patchedConditions);
      console.log(logicAddonValue);
      setLoading(false);
    });
  }, []);

  const updateLogicState = (excludeHiddenFields, conditions) => {
    console.log(111, excludeHiddenFields);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      {
        instance: getParameterByName("instance"),
        comp_id: Wix.Utils.getOrigCompId(),
        name: "Logic",
        value: {
          excludeHiddenFields,
          conditions,
        },
      },
      headers
    );
  };

  const addStatement = () => {
    const statement = {
      id: nanoid(),
      action: "",
      condition: [
        {
          fiel: "",
          item: "",
          rule: "",
          type: "",
          value: "",
        },
      ],
      field: "",
      operator: "and",
    };

    const updatedStatements = [...logicStatements];
    updatedStatements.push(statement);
    setLogicStatements(updatedStatements);
    updateLogicState(excludeHiddenFields, updatedStatements);
  };

  const deleteStatement = (statementId) => {
    const updatedStatements = logicStatements.filter((statement) => {
      return statement.id !== statementId;
    });
    setLogicStatements(updatedStatements);
    updateLogicState(excludeHiddenFields, updatedStatements);
  };

  const getConditionName = (rule) => {
    let value;
    conditions_names.map((item) => {
      if (item.value === rule) {
        value = item.title;
      }
    });
    return value;
  };

  const getFieldById = (formId) => {
    const result = formFields.filter((x) => x.id == formId);
    return result && result[0] ? result[0].label : "";
  };

  const getRules = () => {
    const selectedField = formFields?.find(
      (field) => field.id === newCondition?.fieldId
    );

    // if (selectedField?.fieldName === "terms"){

    // }

    switch (newCondition?.fieldType) {
      case "number":
      case "date":
      case "time":
      case "price":
        return inputRules.map((rule) => (
          <ListItemSelect
            key={rule.value}
            title={rule.title}
            selected={newCondition?.rule === rule.value}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule?.value,
              }))
            }
          />
        ));
      case "checkbox":
        return checkboxRules.map((rule) => (
          <ListItemSelect
            key={rule.value}
            title={rule.title}
            selected={newCondition?.rule === rule.value}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule?.value,
              }))
            }
          />
        ));
      case "radio":
      case "select":
        return selectRules.map((rule) => (
          <ListItemSelect
            key={rule.value}
            title={rule.title}
            selected={newCondition?.rule === rule.value}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule?.value,
              }))
            }
          />
        ));
      case "starrating":
      case "scalerating":
        return ratingRules.map((rule) => (
          <ListItemSelect
            key={rule.value}
            title={rule.title}
            selected={newCondition?.rule === rule.value}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule?.value,
              }))
            }
          />
        ));
      case "file":
        return fileRules.map((rule) => (
          <ListItemSelect
            key={rule}
            title={rule}
            selected={newCondition?.rule === rule}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule,
              }))
            }
          />
        ));
      default:
        return defaultRules.map((rule) => (
          <ListItemSelect
            key={rule.value}
            title={rule.title}
            selected={newCondition?.rule === rule.value}
            onClick={() =>
              setNewCondition((prev) => ({
                ...prev,
                rule: rule?.value,
              }))
            }
          />
        ));
    }
  };

  return (
    <div className={classes.logic_container}>
      {/* PAGE CONTENT */}

      <Page className={classes.statements_page}>
        <Page.Header title="Statements" size="large" />

        <Page.Content>
          {loading ? (
            <Box className={classes.statements_layout}>
              <Loader statusMessage="Uploading" />
            </Box>
          ) : logicStatements?.length > 0 ? (
            <Box direction="vertical" gap={5}>
              <Box direction="horizontal" alignItems="center" gap={5}>
                <Text>Exclude Hidden Fields</Text>
                <ToggleSwitch
                  label="Exclude Hidden Fields"
                  checked={excludeHiddenFields}
                  onChange={() => setExcludeHiddenFields((prev) => !prev)}
                />
              </Box>
              <Layout>
                {logicStatements?.map((statement, index) => {
                  return (
                    <Cell span={4} key={statement.id}>
                      <Statement
                        index={index}
                        statement={statement}
                        deleteStatement={deleteStatement}
                      />
                    </Cell>
                  );
                })}
                <Cell span={4}>
                  <Box width="100%">
                    <AddItem onClick={() => addStatement()}>
                      Add New Statement
                    </AddItem>
                  </Box>
                </Cell>
              </Layout>
            </Box>
          ) : (
            <EmptyState
              className={classes.empty_state}
              title="No Statements Found"
              subtitle="Statements list is empty! Start by adding your first statement"
            >
              <TextButton
                prefixIcon={<Add />}
                onClick={() => {
                  addStatement();
                }}
              >
                Add New Statement
              </TextButton>
            </EmptyState>
          )}
        </Page.Content>
      </Page>
    </div>
  );
};

export default Logic;
