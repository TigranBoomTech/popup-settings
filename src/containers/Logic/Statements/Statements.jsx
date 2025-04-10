import React from "react";
import classes from "./Statements.module.scss";
import {
  Box,
  EmptyState,
  IconButton,
  Page,
  SidePanel,
  Text,
  TextButton,
  ToggleSwitch,
} from "@wix/design-system";
import { Add } from "@wix/wix-ui-icons-common";
import Statement from "./Statement/Statement";
import Show_Hide from "../Show_Hide/Show_Hide";

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
  const [rightPanel, setRightPanel] = React.useState(-600);
  //   const [loading, setLoading] = React.useState(true);

  const openPanel = () => {
    setRightPanel(0);
  };

  const closePanel = () => {
    setRightPanel(-600);
  };

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
                    openPanel();
                  }}
                >
                  Add Statement
                </TextButton>
              }
            </EmptyState>
          )}
        </Page.Content>
      </Page>
      <div
        className={classes.statements_side_panel_container}
        style={{
          right: `${rightPanel}px`,
        }}
      >
        <SidePanel
          title="Statement"
          onCloseButtonClick={closePanel}
          width="600px"
        >
          <SidePanel.Header title="Statement" />
          <SidePanel.Content>
            <Show_Hide />
          </SidePanel.Content>
        </SidePanel>
      </div>
    </div>
  );
};

export default Statements;
