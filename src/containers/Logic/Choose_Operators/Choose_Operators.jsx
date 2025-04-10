import React from "react";
import { Box, Text, Card, Page, Button } from "@wix/design-system";

const ChooseOperators = ({ chooseStatementReq, back }) => {
  return (
    <Page>
      <Page.Header title="Choose Operator" size="large" />
      <Page.Content>
        <Box direction="vertical" gap="24px">
          <Box gap="16px" vertical>
            <Card hoverable>
              <Box direction="vertical" padding="16px">
                <div
                  onClick={() => {
                    chooseStatementReq("or");
                  }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Text size="medium" weight="bold">
                    Or
                  </Text>
                  <Text size="small" secondary>
                    Statement functions if any of the conditions is true.
                  </Text>
                </div>
              </Box>
            </Card>

            <Card hoverable>
              <Box direction="vertical" padding="16px">
                <div
                  onClick={() => chooseStatementReq("and")}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Text size="medium" weight="bold">
                    And
                  </Text>
                  <Text size="small" secondary>
                    Statement functions if all of the conditions are true.
                  </Text>
                </div>
              </Box>
            </Card>
          </Box>
        </Box>
        <Box marginTop="24px">
          <Button onClick={back}>Back</Button>
        </Box>
      </Page.Content>
    </Page>
  );
};

export default ChooseOperators;
