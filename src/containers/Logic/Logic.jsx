import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";

import ChooseFields from "./Choose_Fields/Choose_Fields";
import Statements from "./Statements/Statements";

import slide_pages from "../../helpers/logic/slide_pages";
import type_texts from "../../helpers/logic/type_texts";
import conditions_names from "../../helpers/logic/conditions_names";
import { getParameterByName } from "../../helpers/common";
import Show_Hide from "./Show_Hide/Show_Hide";
import {
  Box,
  EmptyState,
  IconButton,
  Loader,
  Page,
  SidePanel,
  Text,
  TextButton,
  ToggleSwitch,
} from "@wix/design-system";

import classes from "./Logic.module.scss";
import { Add } from "@wix/wix-ui-icons-common";
import Statement from "./Statements/Statement/Statement";

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

  const [logicFields, setLogicFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layoutCount, setLayoutCount] = useState(0);
  const [panel, setPanel] = useState(-600);
  const [excludeHiddenFields, setExcludeHiddenFields] = useState(false);

  const headers = {
    headers: { PLATFORM: "_WIX" },
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    let array = logicFields;
    const filteredItems = array.filter(
      (item) => item && item.condition && item.condition.length !== 0
    );
    setLogicFields(filteredItems);
  }, [compsToDisplay.statementsList]);

  useEffect(() => {
    if (formFields != null && logicFields[0] == null) {
      setCompsToDisplay({
        ...compsToDisplay,
        actionComps: true,
        chooseField: false,
        statementsList: false,
      });
    }
  }, [logicFields]);

  useLayoutEffect(() => {
    if (compsToDisplay.chooseField) {
      slide_pages("slideToLeft", "bma_slide_div");
      let typeVisibility =
        compsToDisplay.fieldVisibility === "show" ? "Show" : "Hide";
      if (document.getElementsByClassName("bma_rule_text")[0]) {
        type_texts(typeVisibility);
      }
    }
  }, [compsToDisplay]);

  const openPanel = () => {
    setPanel(0);
  };

  const closePanel = (xBtn) => {
    if (xBtn) {
      let array = [...logicFields];
      array.pop();
      setLogicFields(array);
    }
    setPanel(-600);
  };

  const onActionClick = (visibility) => {
    let array = [...logicFields];
    array.push({
      action: visibility,
      condition: [],
      field: "",
      operator: "and",
    });
    setLogicFields(array);
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
    slide_pages("slideToRight", "bma_slide_parent");
  };

  const addNewLogicValue = () => {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: true,
      chooseField: false,
      statementsList: false,
    });
    slide_pages("slideToLeft", "bma_slide_parent");
  };

  const backToMainDrill = () => {
    if (logicFields[0].condition.length > 0) {
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
                  setLogicFields(
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
                  setLogicFields(
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

  const deleteLogic = (value, key) => {
    let array = [...logicFields];
    array.splice(key, 1);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(array),
      headers
    );
    setLogicFields(array);
  };

  const deleteStatement = (key, condKey) => {
    let array = [...logicFields];
    if (array[key].condition.length === 1) {
      array.splice(key, 1);
    } else {
      array[key].condition.splice(condKey, 1);
    }
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(array),
      headers
    );
    setLogicFields(array);
  };

  const handleToggleChange = (e) => {
    const checked = e.target.checked;
    setExcludeHiddenFields(checked);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(logicFields, checked),
      headers
    );
  };

  return (
    <div className={classes.logic_container}>
      <Page className={classes.statements_page}>
        <Page.Header
          title="Statements"
          size="large"
          actionsBar={
            logicFields.length > 0 && (
              <IconButton
                size="medium"
                onClick={() => {
                  openPanel();
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
          ) : logicFields.length > 0 ? (
            <Box direction="vertical">
              <Box direction="horizontal" alignItems="center" gap={5}>
                <Text>Exclude Hidden Fields</Text>
                <ToggleSwitch
                  label="Exclude Hidden Fields"
                  checked={excludeHiddenFields}
                  onChange={handleToggleChange}
                />
              </Box>
              <Box className={classes.logics_layout}>
                {logicFields.map((item, index) => (
                  <Box key={index} className={classes.logics_grid_item}>
                    <Statement
                      item={item}
                      index={index}
                      getFieldById={getFieldById}
                      getConditionName={getConditionName}
                      deleteStatement={deleteStatement}
                      addNewConditionValue={addNewConditionValue}
                      deleteLogic={deleteLogic}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <EmptyState
              className={classes.empty_state}
              title="No Statements Found"
              subtitle="Statements list is empty ! Start by adding your first statement"
            >
              <TextButton
                prefixIcon={<Add />}
                onClick={() => {
                  openPanel();
                  addNewLogicValue();
                }}
              >
                Add Statement
              </TextButton>
            </EmptyState>
          )}
        </Page.Content>
      </Page>

      <div
        className={classes.logic_side_panel}
        style={{
          right: `${panel}px`,
          width: panel === 0 ? "100vw" : "0px",
        }}
      >
        <SidePanel
          title="Statement"
          onCloseButtonClick={() => closePanel(true)}
          width="100vw"
        >
          <SidePanel.Header title="Statement" />
          <SidePanel.Content>
            {compsToDisplay.actionComps && (
              <Show_Hide
                onActionClick={onActionClick}
                displayStatements={displayStatements}
                back={
                  logicFields[0] &&
                  logicFields[0].condition.length > 0 &&
                  compsToDisplay.actionComps
                }
              />
            )}

            {compsToDisplay.chooseField && (
              <ChooseFields
                backToMainDrill={backToMainDrill}
                logicFields={logicFields}
                displayStatements={displayStatements}
                statementIndex={compsToDisplay.statementIndex}
                fields={formFields}
                newField={compsToDisplay.newField}
                type={compsToDisplay.fieldVisibility}
                changeView={changeView}
                excludeHiddenFields={excludeHiddenFields}
                closePanel={closePanel}
              />
            )}
          </SidePanel.Content>
        </SidePanel>
      </div>
    </div>
  );
};

export default Logic;
