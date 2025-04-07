import React from "react";

export default function ChooseOperators(props) {
  return (
    <div className={"bma_operators_parent"}>
      <h3 className="bma_page_title">Choose Statement Requirement</h3>
      <div
        className={"bma_action_or"}
        onClick={() => props.chooseStatementReq("or")}
      >
        <div className={"bma_statementsReq_value"}>Or</div>
        <div className={"bma_desc_text"}>
          Statement functions if any of the conditions is true.
        </div>
      </div>
      <div
        className={"bma_action_and"}
        onClick={() => props.chooseStatementReq("and")}
      >
        <div className={"bma_statementsReq_value"}>And</div>
        <div className={"bma_desc_text"}>
          Statement functions if all of the conditions are true.
        </div>
      </div>
    </div>
  );
}
