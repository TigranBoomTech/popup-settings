import React, { Fragment, useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";

import { ToggleSwitch } from "@wix/design-system";
import ShowHideComps from "./components/ShowHideComps";
import ChooseFields from "./components/ChooseFields";

import slide_pages from "../../helpers/logic/slide_pages";
import type_texts from "../../helpers/logic/type_texts";
import conditions_names from "../../helpers/logic/conditions_names";
import { getParameterByName } from "../../helpers/common";

export default function Logic() {
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

  function onActionClick(visibility) {
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
  }
  function changeView() {
    let number = layoutCount + 1;
    setLayoutCount(number);
  }
  function addNewCondValue(key) {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: false,
      chooseField: true,
      statementsList: false,
      newField: false,
      statementIndex: key,
    });
  }
  function displayStatements() {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: false,
      chooseField: false,
      statementsList: true,
    });
    slide_pages("slideToRight", "bma_slide_parent");
  }
  function addNewLogicValue() {
    setCompsToDisplay({
      ...compsToDisplay,
      actionComps: true,
      chooseField: false,
      statementsList: false,
    });
    slide_pages("slideToLeft", "bma_slide_parent");
  }
  function backToMainDrill() {
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
  }
  function getCondName(rule) {
    let value;
    conditions_names.map((item) => {
      if (item.value === rule) {
        value = item.title;
      }
    });
    return value;
  }
  function getOptions() {
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
  }
  function getFieldById(formId) {
    const result = formFields.filter((x) => x.id == formId);
    return result && result[0] ? result[0].label : "";
  }
  function getPushLogic(array, exclude) {
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
  }

  function deleteLogic(value, key) {
    let array = [...logicFields];
    array.splice(key, 1);
    axios.post(
      import.meta.env.VITE_BOOMTECH_API + `/addon`,
      getPushLogic(array),
      headers
    );
    setLogicFields(array);
  }
  function deleteStatement(key, condKey) {
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
  }
  function showDelIcon(key, condKey) {
    document.getElementsByClassName("" + key + condKey + "")[0].style.display =
      "block";
  }
  function hideDelIcon(key, condKey) {
    document.getElementsByClassName("" + key + condKey + "")[0].style.display =
      "none";
  }

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
    <div className={"bma_logic_parent"} id={"bma_slide_parent"}>
      {compsToDisplay.actionComps && (
        <Fragment>
          <div className={"bma_choose_action"} id={"bma_slide_div"}>
            <h3 className={"bma_page_title"}>Action</h3>
            <h4 className={"bma_page_desc"}>
              Choose whenever to Show or Hide field if the condition is true
            </h4>
            <ShowHideComps
              onClick={onActionClick}
              classNames={{
                action: "bma_action show",
                showIcon: "bma_show_icon",
                showDesc: "bma_show_desc",
              }}
              fieldVisibility={"show"}
            />
            <ShowHideComps
              onClick={onActionClick}
              classNames={{
                action: "bma_action hide",
                showIcon: "bma_hide_icon",
                showDesc: "bma_hide_desc",
              }}
              fieldVisibility={"hide"}
            />
          </div>
        </Fragment>
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
      )}
      {compsToDisplay.statementsList && (
        <div className={"bma_ready_statements"} id={"bma_slide_div"}>
          <h3 className={"bma_page_title"}>Statements</h3>
          <ToggleSwitch
            label="Exclude Hidden Fields"
            checked={excludeHiddenFields}
            onChange={handleToggleChange}
          />
          <div className={"bma_statements_list"}>
            {logicFields.map((item, key) => (
              <div key={key} className={"bma_statement"}>
                <span
                  className={"bma_add_cond"}
                  onClick={() => addNewCondValue(key)}
                  title="Add a New Condition"
                ></span>
                <span
                  onClick={() => deleteLogic(item, key)}
                  className={"bma_delete_statement"}
                  title="Delete Statement"
                ></span>
                <div className={"bma_statement_header"}>
                  {(item.action === "show" ? "Show" : "Hide") +
                    " '" +
                    getFieldById(item.field) +
                    "' field if"}
                </div>
                {item.condition.map((condItem, condKey) => (
                  <div
                    key={condKey}
                    className={"bma_conditions_rule"}
                    onMouseEnter={() => showDelIcon(key, condKey)}
                    onMouseLeave={() => hideDelIcon(key, condKey)}
                  >
                    <p className={"bma_cond_display"}>
                      {"'" +
                        getFieldById(condItem.field) +
                        (condItem.item ? " " + condItem.item + "' " : "' ") +
                        getCondName(condItem.rule) +
                        " '" +
                        condItem.value +
                        "'"}{" "}
                    </p>
                    <span
                      className={"bma_conditions_delete" + " " + key + condKey}
                      onClick={() => deleteStatement(key, condKey)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="bmf-logic-add-button">
            <a
              className={"bma_add_new_statement"}
              onClick={() => addNewLogicValue()}
            >Saint Hov baaaaylus</a>
          </div>
        </div>
      )}
      {logicFields[0] &&
        logicFields[0].condition.length > 0 &&
        compsToDisplay.actionComps && (
          <div onClick={() => displayStatements()} className={"bma_back"}>
            back
          </div>
        )}
    </div>
  );
}
