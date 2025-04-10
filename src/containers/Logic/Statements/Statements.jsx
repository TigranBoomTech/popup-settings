import React from "react";
import classes from "./Statements.module.scss";
import {
  Box,
  EmptyState,
  IconButton,
  Page,
  Text,
  TextButton,
  ToggleSwitch,
} from "@wix/design-system";
import { Add } from "@wix/wix-ui-icons-common";
import Statement from "./Statement/Statement";

const Statements = ({
  logicFields,
  addNewLogicValue,
  excludeHiddenFields,
  handleToggleChange,
  getFieldById,
  getConditionName,
  deleteStatement,
  addNewConditionValue,
  deleteLogic,
  openPanel,
}) => {
  return (
    <Page className={classes.statements_page}>
      <Page.Header
        title="Statements"
        size="large"
        actionsBar={
          logicFields.length > 0 && (
            <IconButton
              size="medium"
              onClick={() => {
                openPanel();
                addNewLogicValue();
              }}
            >
              <Add />
            </IconButton>
          )
        }
      />
      <Page.Content>
        {logicFields.length > 0 ? (
          <Box direction="vertical">
            <Box direction="horizontal" alignItems="center" gap={5}>
              <Text>Exclude Hidden Fields</Text>
              <ToggleSwitch
                label="Exclude Hidden Fields"
                checked={excludeHiddenFields}
                onChange={handleToggleChange}
              />
            </Box>
            <Box className={classes.logics_layout}>
              {logicFields.map((item, index) => {
                return (
                  <Box key={index} className={classes.logics_grid_item}>
                    <Statement
                      item={item}
                      index={index}
                      getFieldById={getFieldById}
                      getConditionName={getConditionName}
                      deleteStatement={deleteStatement}
                      addNewConditionValue={addNewConditionValue}
                      deleteLogic={deleteLogic}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <EmptyState
            className={classes.empty_state}
            title="No Statements Found"
            subtitle="Statements list is empty ! Start by adding your first statement"
          >
            {
              <TextButton
                prefixIcon={<Add />}
                onClick={() => {
                  addNewLogicValue();
                }}
              >
                Add Statement
              </TextButton>
            }
          </EmptyState>
        )}
      </Page.Content>
    </Page>
  );
};

export default Statements;
