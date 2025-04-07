import React, { useState } from "react";
import axios from "axios";

import CountryList from "./CountryList";

import slide_pages from "../../../helpers/logic/slide_pages";
import {getParameterByName} from "../../../helpers/common";

export default function ChooseValue(props) {
  const [chooseValue, setChooseValue] = useState({
    textValue: true,
    operatorValue: false,
  });
  let showCountrylist =
    props.paramsToSubmit[props.objIndex].condition[props.condIndex].item ===
    "country"
      ? true
      : false;

  function setSelectValues() {
    let selectValues;
    let condition =
      props.paramsToSubmit[props.objIndex].condition[props.condIndex];
    if (condition.type === "checkbox") {
      if (condition.rule === "checked" || condition.rule === "dnotchecked") {
        if (props.whenField.fieldName === "terms") {
          selectValues = [props.whenField.options[0].descPlaceholder];
        } else {
          selectValues =
            props.whenField.options &&
            props.whenField.options.map((item) => {
              return item.name;
            });
        }
      } else if (condition.rule === "checkedmore") {
        selectValues =
          props.whenField.options &&
          props.whenField.options.map((item, key) => {
            return key;
          });
      } else if (condition.rule === "checkedless") {
        selectValues =
          props.whenField.options &&
          props.whenField.options.map((item, key) => {
            return key + 2;
          });
      } else {
        selectValues =
          props.whenField.options &&
          props.whenField.options.map((item, key) => {
            return key + 1;
          });
      }
    } else {
      selectValues =
        props.whenField.options &&
        props.whenField.options.map((item) => {
          return item.name;
        });
    }
    return selectValues;
  }

  function checkValueType() {
    let inputType;
    switch (
      props.paramsToSubmit[props.objIndex].condition[props.condIndex].type
    ) {
      case "date":
        inputType = "date";
        break;
      case "time":
        inputType = "time";
        break;
      case "number":
      case "price":
      case "starrating":
      case "scalerating":
      case "select":
      case "radio":
      case "checkbox":
        inputType = "number";
        break;
      case "address":
        if (!showCountrylist) inputType = "text";
        break;

      default:
        inputType = "text";
    }
    return inputType;
  }

  const pushData = {
    instance: getParameterByName("instance"),
    comp_id: Wix.Utils.getOrigCompId(),
    name: "Logic",
    value: {
      conditions: props.paramsToSubmit,
      excludeHiddenFields: props.excludeHiddenFields,
    },
  };
  function saveStatement(item) {
    const headers = {
      headers: { PLATFORM: "_WIX" },
    };
    if (
      (props.whenField.options && props.whenField.options.length > 0) ||
      showCountrylist
    ) {
      props.createLogic(item);
      props.displayStatements();
      axios.post(process.env.BOOMTECH_API + `/addon`, pushData, headers);
      slide_pages("slideToLeft");
    } else {
      props.displayStatements();
      axios.post(process.env.BOOMTECH_API + `/addon`, pushData, headers);
      slide_pages("slideToLeft");
    }
  }

  let inputPrice =
    props.paramsToSubmit[props.objIndex].condition[props.condIndex].type ===
    "price";
  let valueType =
    props.paramsToSubmit[props.objIndex].condition[props.condIndex].type;
  const isQuantityRule =
    (props.paramsToSubmit[props.objIndex].condition[
      props.condIndex
    ].rule.includes("quantity") &&
      valueType === "select") ||
    (props.paramsToSubmit[props.objIndex].condition[
      props.condIndex
    ].rule.includes("quantity") &&
      valueType === "radio") ||
    (props.paramsToSubmit[props.objIndex].condition[
      props.condIndex
    ].rule.includes("quantity") &&
      valueType === "checkbox");

  let inputTypeText = !(
    valueType === "checkbox" ||
    valueType === "radio" ||
    valueType === "select" ||
    showCountrylist
  );
  return (
    <div id={"bma_slide_div"}>
      <h3 className={"bma_page_title"}>Choose Value</h3>
      {inputTypeText || isQuantityRule ? (
        <div>
          {chooseValue.textValue && (
            <div className={"bma_cond_value"}>
              <input
                className={
                  inputPrice
                    ? "bma_logic_input_value bma_price_value"
                    : "bma_logic_input_value"
                }
                type={checkValueType()}
                onChange={(e) => props.createLogic(e.target.value)}
                placeholder={inputPrice ? "Dollars" : ""}
              />
              {inputPrice && (
                <input
                  onChange={(e) => props.createLogic(e.target.value)}
                  className={"bma_logic_input_value bma_price_value"}
                  type={"number"}
                  placeholder={"Cents"}
                />
              )}
              <div className={"bma_save_add_buttons"}>
                <span
                  className="bma_save_condition"
                  onClick={() =>
                    saveStatement(
                      String(
                        props.paramsToSubmit[props.objIndex].condition[
                          props.condIndex
                        ].value
                      )
                    )
                  }
                >
                  Save Statement
                </span>
                <span
                  className="bma_add_condition"
                  onClick={() => props.addNewCondition()}
                >
                  Add new Condition
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={"bma_select_fields"}>
          {!showCountrylist ? (
            <div className={"bma_opt_values"}>
              {setSelectValues().map((item, key) => (
                <div
                  key={key}
                  className={"bma_field"}
                  onClick={() => saveStatement(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <CountryList saveStatement={saveStatement} />
          )}
        </div>
      )}
    </div>
  );
}
