import React, { useState, useEffect } from "react";
import axios from "axios";
import conditions_names from "../../helpers/logic/conditions_names";
import { getParameterByName } from "../../helpers/common";

import {
  Accordion,
  accordionItemBuilder,
  AddItem,
  Box,
  Card,
  CustomModalLayout,
  EmptyState,
  Heading,
  IconButton,
  ListItemSelect,
  Loader,
  Modal,
  Page,
  PopoverMenu,
  SidePanel,
  Text,
  TextButton,
  Thumbnail,
  ToggleSwitch,
} from "@wix/design-system";

import classes from "./Logic.module.scss";
import {
  Add,
  Adjust,
  Delete,
  Edit,
  Hidden,
  More,
  Visible,
} from "@wix/wix-ui-icons-common";
import {
  addressFields,
  checkboxRules,
  defaultRules,
  fileRules,
  inputRules,
  ratingRules,
  selectRules,
} from "../../helpers/logic/rules";

const Logic = () => {
  const pushData = {
    instance: getParameterByName("instance"),
    comp_id: Wix.Utils.getOrigCompId(),
    locale: "en",
  };

  const [formFields, setFormFields] = useState();
  const [compsToDisplay, setCompsToDisplay] = useState({
    actionComps: false,
    chooseField: false,
    statementsList: false,
    fieldVisibility: "",
    newField: "",
    statementIndex: 0,
  });

  const [logicStatements, setLogicStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layoutCount, setLayoutCount] = useState(0);
  const [excludeHiddenFields, setExcludeHiddenFields] = useState(false);

  const [conditionsPanel, setConditionsPanel] = useState(-440);
  const [statementPanel, setStatementPanel] = useState(-440);
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);

  const [currentStatement, setCurrentStatement] = useState(null);
  const [newCondition, setNewCondition] = useState(null);

  console.log("CURRENT", currentStatement);
  console.log("CONDITION", newCondition);

  const openConditionsPanel = () => {
    setConditionsPanel(0);
  };

  const closeConditionsPanel = () => {
    setConditionsPanel(-440);
  };

  const openStatementPanel = () => {
    setStatementPanel(0);
  };

  const closeStatementPanel = () => {
    setStatementPanel(-440);
  };

  const headers = {
    headers: { PLATFORM: "_WIX" },
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    let array = logicStatements;
    const filteredItems = array.filter(
      (item) => item && item.condition && item.condition.length !== 0
    );
    setLogicStatements(filteredItems);
  }, [compsToDisplay.statementsList]);

  useEffect(() => {
    if (formFields != null && logicStatements[0] == null) {
      setCompsToDisplay({
        ...compsToDisplay,
        actionComps: true,
        chooseField: false,
        statementsList: false,
      });
    }
  }, [logicStatements]);

  const onActionClick = (visibility) => {
    let array = [...logicStatements];
    array.push({
      action: visibility,
      condition: [],
      field: "",
      operator: "and",
    });
    setLogicStatements(array);
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: false,
      chooseField: true,
      fieldVisibility: visibility,
      newField: true,
      statementIndex: array.length - 1,
    });
  };

  const changeView = () => {
    let number = layoutCount + 1;
    setLayoutCount(number);
  };

  const addNewConditionValue = (key) => {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: false,
      chooseField: true,
      statementsList: false,
      newField: false,
      statementIndex: key,
    });
  };

  const displayStatements = () => {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: false,
      chooseField: false,
      statementsList: true,
    });
    closePanel();
  };

  const addNewLogicValue = () => {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: true,
      chooseField: false,
      statementsList: false,
    });
  };

  const backToMainDrill = () => {
    if (logicStatements[0].condition.length > 0) {
      setCompsToDisplay({
        ...compsToDisplay,
        actionComps: false,
        chooseField: false,
        statementsList: true,
      });
    } else {
      setCompsToDisplay({
        ...compsToDisplay,
        actionComps: true,
        chooseField: false,
        statementsList: false,
      });
    }
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

  const getOptions = () => {
    axios
      .get(import.meta.env.VITE_BOOMTECH_API + "/option", {
        headers: {
          PLATFORM: "_WIX",
        },
        params: {
          ...pushData,
        },
      })
      .then((res) => {
        setFormFields(res.data.fields);
        if (res.data.addons) {
          res.data.addons.map((item) => {
            if (item.name === "Logic") {
              if (Array.isArray(item.value)) {
                if (item.value) {
                  setLogicStatements(
                    item.value.filter(
                      (item) =>
                        item && item.condition && item.condition.length !== 0
                    )
                  );
                  setCompsToDisplay({
                    ...compsToDisplay,
                    statementsList: true,
                  });
                } else {
                  setCompsToDisplay({ ...compsToDisplay, actionComps: true });
                }
              } else {
                if (item.value?.conditions) {
                  setLogicStatements(
                    item.value.conditions.filter(
                      (item) =>
                        item && item.condition && item.condition.length !== 0
                    )
                  );
                  setCompsToDisplay({
                    ...compsToDisplay,
                    statementsList: true,
                  });
                } else {
                  setCompsToDisplay({ ...compsToDisplay, actionComps: true });
                }

                item.value?.excludeHiddenFields &&
                  setExcludeHiddenFields(item.value?.excludeHiddenFields);
              }
            }
          });
        }
        setLoading(false);
      });
  };

  const getFieldById = (formId) => {
    const result = formFields.filter((x) => x.id == formId);
    return result && result[0] ? result[0].label : "";
  };

  const getPushLogic = (array, exclude) => {
    let pushLogic = {
      instance: getParameterByName("instance"),
      comp_id: Wix.Utils.getOrigCompId(),
      name: "Logic",
      value: {
        excludeHiddenFields:
          exclude !== undefined ? exclude : excludeHiddenFields,
        conditions: array,
      },
    };
    return pushLogic;
  };

  const deleteLogic = (index) => {
    let array = [...logicStatements];
    array.splice(index, 1);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(array),
      headers
    );
    setLogicStatements(array);
  };

  const deleteStatement = (conditionIndex) => {
    const { statement, index } = currentStatement;
    const updatedStatements = [...logicStatements];

    if (!statement || typeof index !== "number") return;

    if (statement.condition.length === 1) {
      updatedStatements.splice(index, 1);
    } else {
      const updatedConditions = statement.condition.filter(
        (_, i) => i !== conditionIndex
      );
      updatedStatements[index] = {
        ...statement,
        condition: updatedConditions,
      };
    }

    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(updatedStatements),
      headers
    );

    setLogicStatements(updatedStatements);

    if (updatedStatements[index]) {
      setCurrentStatement({
        statement: updatedStatements[index],
        index,
      });
    } else {
      setCurrentStatement(null);
      closeConditionsPanel();
    }
  };

  const handleToggleChange = (e) => {
    const checked = e.target.checked;
    setExcludeHiddenFields(checked);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(logicStatements, checked),
      headers
    );
  };

  const getRules = () => {
    const selectedField = formFields?.find(
      (field) => field.id === newCondition?.fieldId
    );

    console.log("SELECTED", selectedField);
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

  // const getSubFields = () => {
  //   if (newCondition.fieldType === "address") {
  //     return addressFields.map((field) => <ListItemSelect key={field.value} />);
  //   }
  // };

  return (
    <div className={classes.logic_container}>
      {/* PAGE CONTENT */}

      <Page className={classes.statements_page}>
        <Page.Header
          title="Statements"
          size="large"
          actionsBar={
            logicStatements.length > 0 && (
              <IconButton
                size="medium"
                onClick={() => {
                  openStatementPanel();
                  addNewLogicValue();
                }}
              >
                <Add />
              </IconButton>
            )
          }
        />

        <Page.Content>
          {loading ? (
            <Box className={classes.statements_layout}>
              <Loader statusMessage="Uploading" />
            </Box>
          ) : logicStatements.length > 0 ? (
            <>
              <Box direction="horizontal" alignItems="center" gap={5}>
                <Text>Exclude Hidden Fields</Text>
                <ToggleSwitch
                  label="Exclude Hidden Fields"
                  checked={excludeHiddenFields}
                  onChange={handleToggleChange}
                />
              </Box>

              <Box className={classes.statements_layout}>
                {logicStatements.map((item, index) => (
                  <Box key={index} direction="vertical">
                    <Box className={classes.logics_layout}>
                      <Card>
                        <Card.Header
                          title={`Statement ${index + 1}`}
                          suffix={
                            <PopoverMenu
                              minWidth="240px"
                              triggerElement={
                                <IconButton priority="secondary" size="small">
                                  <More />
                                </IconButton>
                              }
                              size="small"
                              appendTo="window"
                            >
                              <PopoverMenu.MenuItem
                                text="Manage Conditions"
                                prefixIcon={<Adjust />}
                                onClick={() => {
                                  setCurrentStatement({
                                    statement: item,
                                    index: index,
                                  });
                                  closeStatementPanel();
                                  openConditionsPanel();
                                }}
                              />
                              <PopoverMenu.MenuItem
                                text="Delete Statement"
                                skin="destructive"
                                onClick={() => deleteLogic(index)}
                                prefixIcon={<Delete />}
                              />
                            </PopoverMenu>
                          }
                        />
                      </Card>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <EmptyState
              className={classes.empty_state}
              title="No Statements Found"
              subtitle="Statements list is empty! Start by adding your first statement"
            >
              <TextButton
                prefixIcon={<Add />}
                onClick={() => {
                  openStatementPanel();
                  addNewLogicValue();
                }}
              >
                Add Statement
              </TextButton>
            </EmptyState>
          )}
        </Page.Content>
      </Page>

      {/* CONDITIONS SIDE PANEL */}

      <div
        className={classes.logic_side_panel}
        style={{
          right: `${conditionsPanel}px`,
        }}
      >
        <SidePanel
          title="Manage Conditions"
          onCloseButtonClick={() => closeConditionsPanel()}
        >
          <SidePanel.Header title="Manage Conditions" />

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            direction="vertical"
            gap="20px"
            padding="20px"
            background="white"
          >
            <Text weight="bold" textAlign="center">
              {currentStatement?.statement?.action?.charAt(0)?.toUpperCase() +
                currentStatement?.statement?.action?.slice(1)}
              {"  "}
              {
                formFields?.find(
                  (field) => field.id === currentStatement?.statement?.field
                )?.label
              }{" "}
              If
            </Text>
          </Box>
          <Box
            direction="vertical"
            style={{ height: "100vh", overflow: "scroll" }}
          >
            {currentStatement?.statement?.condition?.length > 0 ? (
              currentStatement.statement.condition.map((condition, index) => {
                const field = formFields.find(
                  (field) => field.id === condition.field
                );

                const conditionValue =
                  typeof condition.value === "object"
                    ? Object.values(condition.value).concat()
                    : condition.value;

                console.log(conditionValue);

                return (
                  <Card
                    key={`Condition-${index}-${currentStatement?.statement.condition.length} `}
                  >
                    <Card.Divider />
                    <Box
                      alignItems="center"
                      justifyContent="space-between"
                      padding="15px 10px"
                      gap={5}
                    >
                      <Box wordBreak="break-word">
                        <Text>
                          {`${field.label} ${condition.rule} ${conditionValue}`}
                        </Text>
                      </Box>

                      <Box gap={2}>
                        <Edit
                          cursor="pointer"
                          cnClick={() => {
                            console.log("Edit");
                          }}
                        />
                        <Delete
                          cursor="pointer"
                          className={classes.delete}
                          onClick={() => {
                            deleteStatement(currentStatement.index);
                          }}
                        />
                      </Box>
                    </Box>
                  </Card>
                );
              })
            ) : (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text textAlign="center">
                  No Conditions found for this statement
                </Text>
              </Box>
            )}
          </Box>
          <Box
            direction="vertical"
            gap="20px"
            padding="20px"
            background="white"
          >
            <AddItem size="tiny" onClick={() => setIsAddConditionOpen(true)}>
              Add Condition
            </AddItem>
          </Box>
        </SidePanel>
      </div>

      {/* CREATE NEW LOGIC SIDE PANEL */}

      <div
        className={classes.logic_side_panel}
        style={{
          right: `${statementPanel}px`,
        }}
      >
        <SidePanel
          title="Statement"
          onCloseButtonClick={() => closeStatementPanel()}
        >
          <SidePanel.Header title="Statement" />
          <SidePanel.Content>
            <Accordion
              items={[
                accordionItemBuilder({
                  title: "Action",
                  children: (
                    <Box direction="horizontal" gap="10px">
                      <Thumbnail
                        size="tiny"
                        hideSelectedIcon
                        height={54}
                        image={<Visible width={90} height={54} />}
                        noPadding
                        title="Show"
                        textPosition="outside"
                      />
                      <Thumbnail
                        size="tiny"
                        hideSelectedIcon
                        height={54}
                        image={<Hidden width={90} height={54} />}
                        noPadding
                        title="Hide"
                        textPosition="outside"
                      />
                    </Box>
                  ),
                }),
              ]}
            />
          </SidePanel.Content>
        </SidePanel>
      </div>

      {/* EDIT CONDITION MODAL */}

      <Modal
        isOpen={isAddConditionOpen}
        onRequestClose={() => setIsAddConditionOpen(false)}
        shouldCloseOnOverlayClick
        screen="desktop"
      >
        <CustomModalLayout
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          primaryButtonOnClick={() => console.log("Nigga")}
          secondaryButtonOnClick={() => setIsAddConditionOpen(false)}
          onCloseButtonClick={() => setIsAddConditionOpen(false)}
          title="Add Condition"
          overflowY="none"
          content={
            <Accordion
              skin="light"
              hideShadow
              items={[
                accordionItemBuilder({
                  title:
                    newCondition?.condition?.charAt(0)?.toUpperCase() +
                      newCondition?.condition?.slice(1) || "Condtion",
                  children: (
                    <Box direction="horizontal" gap="10px">
                      <Thumbnail
                        size="tiny"
                        hideSelectedIcon
                        selected={newCondition?.condition === "or"}
                        onClick={() => {
                          setNewCondition((prev) => ({
                            ...prev,
                            condition: "or",
                          }));
                        }}
                        width={210}
                        height={54}
                        image={
                          <Text width={210} height={54}>
                            Or
                          </Text>
                        }
                        title="Statement functions if any of the conditions is true"
                        textPosition="outside"
                      />
                      <Thumbnail
                        size="tiny"
                        hideSelectedIcon
                        selected={newCondition?.condition === "and"}
                        onClick={() => {
                          setNewCondition((prev) => ({
                            ...prev,
                            condition: "and",
                          }));
                        }}
                        width={210}
                        height={54}
                        image={<Text>And</Text>}
                        title="Statement functions if all of the conditions are true"
                        textPosition="outside"
                      />
                    </Box>
                  ),
                }),
                accordionItemBuilder({
                  title: "Field",
                  children: (
                    <Box direction="vertical">
                      {formFields?.map((field) => {
                        if (field.id !== currentStatement?.statement?.field) {
                          return (
                            <ListItemSelect
                              title={field.label}
                              selected={newCondition?.fieldId === field.id}
                              onClick={() =>
                                setNewCondition((prev) => ({
                                  ...prev,
                                  fieldId: field.id,
                                  fieldType: field.type,
                                }))
                              }
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </Box>
                  ),
                }),

                // (newCondition.fieldType === "name" ||
                //   newCondition.fieldType === "address") &&
                //   accordionItemBuilder({
                //     title: "SubField",
                //     children: getSubFields(),
                //   }),

                accordionItemBuilder({
                  title: "Rule",
                  children: getRules(),
                }),

                accordionItemBuilder({
                  title: "Value",
                  children: (
                    <Box direction="vertical">
                      {formFields?.map((field) => {
                        return <Text>{field.label}</Text>;
                      })}
                    </Box>
                  ),
                }),
              ]}
            />
          }
        />
      </Modal>
    </div>
  );
};

export default Logic;
