import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";

import ChooseFields from "./Choose_Fields/Choose_Fields";
import Statements from "./Statements/Statements";

import slide_pages from "../../helpers/logic/slide_pages";
import type_texts from "../../helpers/logic/type_texts";
import conditions_names from "../../helpers/logic/conditions_names";
import { getParameterByName } from "../../helpers/common";
import Show_Hide from "./Show_Hide/Show_Hide";
import { Button } from "@wix/design-system";

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
  const [layoutCount, setLayoutCount] = useState(0);
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
    <>
      {/* {compsToDisplay.actionComps && (
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
        />
      )} */}

      {/* {compsToDisplay.statementsList && ( */}
        <Statements
          logicFields={logicFields}
          addNewLogicValue={addNewLogicValue}
          excludeHiddenFields={excludeHiddenFields}
          handleToggleChange={handleToggleChange}
          getFieldById={getFieldById}
          getConditionName={getConditionName}
          deleteStatement={deleteStatement}
          addNewConditionValue={addNewConditionValue}
          deleteLogic={deleteLogic}
        />
      {/* )} */}
    </>
  );
};

export default Logic;
