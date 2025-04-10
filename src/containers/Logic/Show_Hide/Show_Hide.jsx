import React from "react";
import { Box, Button, Card, Page } from "@wix/design-system";
import Show from "./Show/Show";
import Hide from "./Hide/Hide";

const Show_Hide = ({ onActionClick, displayStatements, back }) => {
  return (
    <Page>
      <Page.Header
        title="Actions"
        subtitle="Choose whenever to Show or Hide field if the condition is true"
        size="large"
      />
      <Page.Content>
        <Box direction="vertical" gap="24px">
          <Show onActionClick={onActionClick} />
          <Hide onActionClick={onActionClick} />
        </Box>
        {back && (
          <Box marginTop="24px">
            <Button onClick={() => displayStatements()}>Back</Button>
          </Box>
        )}
      </Page.Content>
    </Page>
  );
};

export default Show_Hide;
