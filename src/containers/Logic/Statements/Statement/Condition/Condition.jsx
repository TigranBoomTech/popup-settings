import React from "react";
import classes from "./Condition.module.scss";
import { Box, Text, Card } from "@wix/design-system";
import { Delete } from "@wix/wix-ui-icons-common";

const Condition = ({
  index,
  isLast,
  condition,
  condition_key,
  getFieldById,
  getConditionName,
  deleteStatement,
}) => {
  return (
    <Box direction="vertical" gap={2} className={classes.condition_wrapper}>
      <Box
        className={classes.condition_row}
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Text className={classes.condition_description}>
          {`'${getFieldById(condition.field)}${
            condition.item ? ` ${condition.item}` : ""
          }' ${getConditionName(condition.rule)} '${condition.value}'`}
        </Text>
        <Delete
          className={classes.delete_icon}
          cursor="pointer"
          onClick={() => deleteStatement(index, condition_key)}
        />
      </Box>
      {!isLast && <Card.Divider />}
    </Box>
  );
};

export default Condition;
