import React, { useState } from "react";
import ChooseOperators from "./ChooseOperators";
import ChooseValue from "./ChooseValue";
import slide_pages from "../../../helpers/logic/slide_pages";
import type_texts from "../../../helpers/logic/type_texts";

export default function ChooseFields(props) {
  const [logicParams, setLogicParams] = useState({
    type: props.type === "show" ? "Show" : "Hide",
    step: props.newField ? 1 : 5,
    fields: props.fields,
    listView: "displayFields",
    statementIndex: props.statementIndex,
    rules: [],
    nameFieldsOpen: false,
    addressFieldsOpen: false,
    conditionNumber: 0,
    allSelectedFields: [],
    step1Res: "",
    nameFields: "",
  });
  const [submitParState, setSubmitParState] = useState(props.logicFields);
  const addressFields = [
    { title: "Street Address", value: "street" },
    { title: "Street Address 2", value: "street2" },
    { title: "City", value: "city" },
    { title: "State/Region", value: "state" },
    { title: "Postal/Zip Code", value: "postal" },
    { title: "Country", value: "country" },
  ];
  let objIndex = logicParams.statementIndex;
  function createLogic(field) {
    let text;
    let paramsSampleArray = [...submitParState];
    let condIndex = paramsSampleArray[objIndex].condition.length - 1;
    switch (logicParams.step) {
      case 1:
        text = logicParams.type + ' "' + field.label + '" field, if ';
        setLogicParams({
          ...logicParams,
          type: text,
          step: 2,
          fields: removeFields(field),
          step1Res: text,
          selectedField: field,
        });
        paramsSampleArray[objIndex].field = field.id;
        paramsSampleArray[objIndex].action = props.type;
        setSubmitParState(paramsSampleArray);
        type_texts(text);
        slide_pages("slideToLeft", "bma_slide_div");
        break;
      case 2:
        if (field.type === "address") {
          setLogicParams({
            ...logicParams,
            addressFieldsOpen: !logicParams.addressFieldsOpen,
            selectedField2: field,
          });
        } else if (field.type === "name") {
          let nameFields;
          nameFields =
            props.fields[objIndex].middleName === true
              ? [
                  { title: "First", value: "first" },
                  { title: "Middle", value: "middle" },
                  { title: "Last", value: "last" },
                ]
              : [
                  { title: "First", value: "first" },
                  { title: "Last", value: "last" },
                ];
          setLogicParams({
            ...logicParams,
            nameFieldsOpen: !logicParams.nameFieldsOpen,
            selectedField2: field,
            nameFields: nameFields,
          });
        } else {
          if (field.type) {
            text = logicParams.type + ' "' + field.label + '"';
            paramsSampleArray[objIndex].condition.push({
              field: field.id,
              type: field.type,
            });
            setLogicParams({
              ...logicParams,
              type: text,
              step: 3,
              rules: setLogicFields(field),
              step2Res: text,
              selectedField2: field,
              nameFieldsOpen: false,
              addressFieldsOpen: false,
            });
            type_texts(text);
          } else {
            text =
              logicParams.type +
              ' "' +
              logicParams.selectedField2.label +
              " " +
              field.title +
              '"';
            paramsSampleArray[objIndex].condition.push({
              field: logicParams.selectedField2.id,
              type: logicParams.selectedField2.type,
              item: field.value,
            });
            setLogicParams({
              ...logicParams,
              type: text,
              step: 3,
              rules: setLogicFields(field, field.value),
              step2Res: text,
              selectedField2: logicParams.selectedField2,
              nameFieldsOpen: false,
              addressFieldsOpen: false,
            });
            type_texts(text);
          }
          slide_pages("slideToLeft", "bma_slide_div");
          setSubmitParState(paramsSampleArray);
        }
        break;
      case 3:
        text = logicParams.type + " " + field.title;
        paramsSampleArray[objIndex].condition[condIndex].rule = field.value;
        setSubmitParState(paramsSampleArray);
        setLogicParams({ ...logicParams, type: text, step: 4, step3Res: text });
        slide_pages("slideToLeft", "bma_slide_div");
        type_texts(text);
        break;
      case 4:
        let newVal = field;
        if (logicParams.selectedField2.fieldName === "date") {
          newVal = formatDate(field, logicParams.selectedField2.fieldName);
        }
        text = logicParams.step3Res + " " + newVal;
        if (paramsSampleArray[objIndex].condition[condIndex].type !== "price") {
          paramsSampleArray[objIndex].condition[condIndex].value = newVal;
          setLogicParams({ ...logicParams, type: text });
        } else {
          let priceValue = {
            1: document.getElementsByClassName(
              "bma_logic_input_value bma_price_value"
            )[0].value,
            2: document.getElementsByClassName(
              "bma_logic_input_value bma_price_value"
            )[1].value,
          };
          paramsSampleArray[objIndex].condition[condIndex].value = priceValue;
        }
        document.getElementsByClassName("bma_rule_text")[0].innerHTML =
          logicParams.step3Res + " " + newVal;
        setSubmitParState(paramsSampleArray);
        break;
    }
  }
  function formatDate(date, format) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (format === "MM-DD-YYYY") {
      return [month, day, year].join("-");
    } else {
      return [day, month, year].join("-");
    }
  }
  function setLogicFields(value) {
    let rules;
    switch (value.type) {
      case "number":
      case "date":
      case "time":
      case "price":
        rules = [
          { title: "is", value: "is" },
          { title: "is not", value: "isnot" },
          { title: "greater than", value: "greater" },
          { title: "less than", value: "less" },
        ];
        break;
      case "checkbox":
        rules = [
          { title: "checked", value: "checked" },
          { title: "not Checked", value: "dnotchecked" },
          { title: "checked more than", value: "checkedmore" },
          { title: "checked equal to", value: "checkedequal" },
          { title: "checked less than", value: "checkedless" },
          { title: "quantity equal", value: "quantityEqual" },
          { title: "quantity less", value: "quantityLess" },
          { title: "quantity more", value: "quantityMore" },
        ];
        break;
      case "radio":
      case "select":
        rules = [
          { title: "is", value: "is" },
          { title: "is not", value: "isnot" },
          { title: "quantity equal", value: "quantityEqual" },
          { title: "quantity less", value: "quantityLess" },
          { title: "quantity more", value: "quantityMore" },
        ];
        break;
      case "starrating":
      case "scalerating":
        rules = [
          { title: "greater than", value: "greater" },
          { title: "less than", value: "less" },
        ];
        break;
      case "file":
        rules = ["chosen file", "Don't choose File"];
        break;
      default:
        rules = [
          { title: "is", value: "is" },
          { title: "is not", value: "isnot" },
          { title: "contains", value: "contains" },
          { title: "starts with", value: "starts" },
          { title: "ends with", value: "ends" },
          { title: "does not start", value: "doesNotStart" },
          { title: "does not end", value: "doesNotEnd" },
        ];
        break;
    }
    if (value.value === "country") {
      rules = [
        { title: "is", value: "is" },
        { title: "is not", value: "isnot" },
      ];
    }
    if (value.fieldName === "terms") {
      rules = [
        { title: "checked", value: "checked" },
        { title: "not Checked", value: "dnotchecked" },
      ];
    }
    return rules;
  }
  function removeFields(field) {
    let newFields = logicParams.fields.filter((data) => {
      return (
        data !== field &&
        data.type !== "customHTML" &&
        data.type !== "map" &&
        data.type !== "signature" &&
        data.type !== "file"
      );
    });
    return newFields;
  }
  const back = () => {
    let paramsSampleArray = [...submitParState];
    let condIndex = paramsSampleArray[objIndex].condition.length - 1;
    switch (logicParams.step) {
      case 1:
        props.backToMainDrill();
        slide_pages("slideToRight", "bma_slide_parent");
        document.getElementsByClassName("bma_rule_text")[0].innerHTML = "";
        break;
      case 2:
        if (props.newField) {
          setLogicParams({
            ...logicParams,
            type: props.type === "show" ? "Show" : "Hide",
            step: 1,
            fields: props.fields,
          });
          setSubmitParState(paramsSampleArray);
          document.getElementsByClassName("bma_rule_text")[0].innerHTML =
            props.type === "show" ? "Show" : "Hide";
        } else {
          setLogicParams({
            ...logicParams,
            type: props.type === "show" ? "Show" : "Hide",
            step: 5,
            fields: props.fields,
          });
        }
        slide_pages("slideToRight", "bma_slide_div");
        break;
      case 3:
        setLogicParams({
          ...logicParams,
          type: logicParams.step1Res,
          step: 2,
          fields: removeFields(logicParams.selectedField),
        });
        paramsSampleArray[objIndex].condition.splice([condIndex], 1);
        setSubmitParState(paramsSampleArray);
        document.getElementsByClassName("bma_rule_text")[0].innerHTML =
          logicParams.step1Res ? logicParams.step1Res : "";
        slide_pages("slideToRight", "bma_slide_div");

        break;
      case 4:
        setLogicParams({ ...logicParams, step: 3, type: logicParams.step2Res });
        paramsSampleArray[objIndex].condition[condIndex].value &&
          delete paramsSampleArray[objIndex].condition[condIndex].value;
        delete paramsSampleArray[objIndex].condition[condIndex].rule;
        setSubmitParState(paramsSampleArray);
        document.getElementsByClassName("bma_rule_text")[0].innerHTML =
          logicParams.step2Res;
        slide_pages("slideToRight", "bma_slide_div");

        break;
      case 5:
        slide_pages("slideToRight", "bma_slide_parent");
        if (props.newField) {
          delete paramsSampleArray[objIndex].condition[condIndex].value;
          setLogicParams({
            ...logicParams,
            step: 4,
            type: logicParams.step3Res,
            conditionNumber: logicParams.conditionNumber - 1,
          });
          setTimeout(function () {
            document.getElementsByClassName("bma_rule_text")[0].innerHTML =
              logicParams.step3Res;
          }, 100);
          setSubmitParState(paramsSampleArray);
        } else {
          props.backToMainDrill();
        }
        break;
    }
  };
  function displaySubFields(val) {
    let subFiledWindow = val.map((item, key) => (
      <div
        key={key}
        onClick={() => createLogic(item)}
        className={"bma_sub_field"}
        value={item}
      >
        {item.title}
      </div>
    ));
    return subFiledWindow;
  }
  let fieldsView = logicParams.fields.map((data, key) => (
    <div key={key}>
      <div
        onClick={() => createLogic(data)}
        field_id={data.id}
        className={"bma_field f_" + data.type}
        value={data.label}
      >
        {data.label}
      </div>
      {data.type === "address" &&
        logicParams.step === 2 &&
        logicParams.addressFieldsOpen && (
          <div className={"bma_subfields_cont"}>
            {displaySubFields(addressFields)}
          </div>
        )}
      {data.type === "name" &&
        logicParams.step === 2 &&
        logicParams.nameFieldsOpen && (
          <div className={"bma_subfields_cont"}>
            {displaySubFields(logicParams.nameFields)}
          </div>
        )}
    </div>
  ));
  let logicsView = logicParams.rules.map((item, key) => (
    <div key={key} onClick={() => createLogic(item)} className={"bma_field"}>
      {item.title}
    </div>
  ));
  let fieldToDisplay = logicParams.step === 3 ? logicsView : fieldsView;
  function addNewCondition() {
    setLogicParams({
      ...logicParams,
      step: 5,
      conditionNumber: logicParams.conditionNumber + 1,
    });
    slide_pages("slideToLeft", "bma_slide_parent");
  }
  function chooseStatementReq(value) {
    let paramsSampleArray = [...submitParState];
    paramsSampleArray[logicParams.statementIndex].operator = value;
    setSubmitParState(paramsSampleArray);
    setLogicParams({
      ...logicParams,
      type: props.newField ? logicParams.step1Res : "",
      step: 2,
    });
    slide_pages("slideToLeft", "bma_slide_parent");
  }

  return (
    <div className={"bma_container"}>
      {logicParams.step !== 5 && (
        <div className={"bma_slide_text"}>
          <div className={"bma_rule_desc"}>
            <span className={"bma_rule_text"} />
          </div>
        </div>
      )}
      <div id={"bma_slide_div"}>
        {logicParams.step < 4 && (
          <div className={"bma_choose_fields bma-scroll"}>
            <h3 className={"bma_page_title"}>
              {logicParams.step === 1 && "Choose Field"}
              {logicParams.step === 2 && "Choose When Field"}
              {logicParams.step === 3 && "Choose Rule"}
            </h3>
            <div style={{ margin: "auto", width: "390px", padding: "20px" }}>
              <div
                className={"bma_fields_list"}
                style={{ maxHeight: "100%", marginBottom: "40px" }}
              >
                {fieldToDisplay}
              </div>
            </div>
          </div>
        )}
        {logicParams.step === 4 && (
          <ChooseValue
            toMainPage={props.backToMainDrill}
            displayStatements={props.displayStatements}
            logicParams={logicParams}
            addNewCondition={addNewCondition}
            paramsToSubmit={submitParState}
            objIndex={objIndex}
            condIndex={submitParState[objIndex].condition.length - 1}
            createLogic={createLogic}
            whenField={logicParams.selectedField2}
            excludeHiddenFields={props.excludeHiddenFields}
          />
        )}
        {logicParams.step === 5 && (
          <ChooseOperators chooseStatementReq={chooseStatementReq} />
        )}
      </div>
      <div onClick={back} className={"bma_back"}>
        back
      </div>
    </div>
  );
}
