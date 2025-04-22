import { Box, Card, IconButton, PopoverMenu, Text } from "@wix/design-system";
import { Delete, More } from "@wix/wix-ui-icons-common";
import React, { useEffect } from "react";
import classes from "./Statement.module.scss";

const Statement = ({ index, statement, deleteStatement }) => {
  useEffect(() => {
    console.log(statement);
  }, [statement]);

  return (
    <Card>
      <Card.Header
        title={`Statement ${index + 1}`}
        suffix={
          <PopoverMenu
            triggerElement={
              <IconButton priority="secondary">
                <More />
              </IconButton>
            }
          >
            <PopoverMenu.MenuItem
              skin="destructive"
              text="Delete Statement"
              prefixIcon={<Delete />}
              onClick={() => deleteStatement(statement.id)}
            />
          </PopoverMenu>
        }
      />
      <Card.Divider />
      <Card.Content>
        <Box className={classes.statement} direction="vertical" gap="8px">
          <Text>IF</Text>

        </Box>
      </Card.Content>
    </Card>
  );
};

export default Statement;
