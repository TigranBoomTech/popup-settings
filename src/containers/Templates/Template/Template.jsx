import React from "react";
import { Builder } from "boomform-builder";
import useFields from "../../../hooks/useFields/useFields";
import { Box, Card, Heading, Text } from "@wix/design-system";
import './Form.scss'
import classes from './Template.module.scss'

const Template = (props) => {
  let myFields = [];
  try {
    myFields = JSON.parse(props.template.form_fields);
  } catch (error) {
    console.log(error);
  }
  const { fields } = useFields({
    fields: myFields,
    premium: props.isUserPremium,
  });

  return (
    <Card className={classes.template_card}>
      <Card.Content>
        <Box direction="vertical">
          <Heading className={classes.form_title}>{props.template?.label}</Heading>
          <Text>{props.template?.form_desc}</Text>
        </Box>
        <Builder
          global={{
            onSubmit: ({ state }) => {
              console.log("Mock submit, state: ", state);
            },
            isSubmitButtonInLastPage: false,
          }}
          fields={fields}
          button={{
            text: `${props.template.submit_text}` || "Submit",
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default Template;
