import React from "react";
import { Box, Card, Text } from "@wix/design-system";
import { Hidden } from "@wix/wix-ui-icons-common";
import classes from "./Hide.module.scss";

const Hide = ({ onActionClick }) => {
  return (
    <div onClick={() => onActionClick("hide")} className={classes.wrapper}>
      <Card>
        <Card.Header
          title="Hide"
          subtitle="Firstly the field is available and will be hidden if the condition
          happens."
          suffix={<Hidden size="70px" />}
        />
      </Card>
    </div>
  );
};

export default Hide;
