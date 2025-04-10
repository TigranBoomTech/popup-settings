import React from "react";
import { Box, Card, Text } from "@wix/design-system";
import { Visible } from "@wix/wix-ui-icons-common";
import classes from "./Show.module.scss";

const Show = ({ onActionClick }) => {
  return (
    <div onClick={() => onActionClick("hide")} className={classes.wrapper}>
      <Card>
        <Card.Header
          title="Show"
          subtitle="Firstly the field is hidden and will appear if the condition
            happens."
          suffix={<Visible size="70px" />}
        />
      </Card>
    </div>
  );
};

export default Show;
