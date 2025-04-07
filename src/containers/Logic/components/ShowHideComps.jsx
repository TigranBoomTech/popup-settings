import React from "react";

export default function ShowHideComps(props) {
  let text =
    props.fieldVisibility === "show"
      ? "Firstly the field is hidden and will appear if the condition happens."
      : "Firstly the field is available and will be hidden if the condition happens.";
  return (
    <div
      onClick={() => props.onClick(props.fieldVisibility)}
      className={props.classNames.action}
    >
      <div className={props.classNames.showIcon}></div>
      <div className={props.classNames.showDesc}>{text}</div>
    </div>
  );
}
