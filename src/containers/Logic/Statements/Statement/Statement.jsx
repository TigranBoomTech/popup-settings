import React from "react";
import classes from "./Statement.module.scss";
import { Box, Card, Text } from "@wix/design-system";
import { Add, Delete } from "@wix/wix-ui-icons-common";
import Condition from "./Condition/Condition";

const Statement = ({
  item,
  index,
  getFieldById,
  getConditionName,
  deleteStatement,
  addNewConditionValue,
  deleteLogic,
}) => {
  return (
    <Card>
      <Card.Header
        title={`${item.action === "show" ? "Show" : "Hide"} '${getFieldById(
          item.field
        )}' field if`}
      />
      <Card.Divider />
      <Card.Content>
        <Box
          className={classes.conditions_wrapper}
          direction="vertical"
          gap={2}
        >
          {item.condition.map((condition, condition_key) => (
            <Condition
              key={condition_key}
              index={index}
              isLast={condition_key === item.condition.length - 1}
              condition={condition}
              condition_key={condition_key}
              getFieldById={getFieldById}
              getConditionName={getConditionName}
              deleteStatement={deleteStatement}
            />
          ))}
        </Box>
      </Card.Content>
      <Card.Divider />
      <Card.Content>
        <Add cursor="pointer" onClick={() => addNewConditionValue(index)} />
        <Delete cursor="pointer" onClick={() => deleteLogic(item, index)} />
      </Card.Content>
    </Card>
  );
};

export default Statement;
