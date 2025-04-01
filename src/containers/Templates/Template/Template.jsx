import React, { useState } from "react";
import { Builder } from "boomform-builder";
import useFields from "../../../hooks/useFields/useFields";
import {
  Card,
  Button,
  Modal,
  CustomModalLayout,
  Box,
  Text,
  Heading,
} from "@wix/design-system";
import "./Form.scss";
import classes from "./Template.module.scss";

const Template = (props) => {
  const [hover, setHover] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [showMoreInforModal, setShowMoreInfoModal] = useState(false);

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

  const handleConfirm = () => {
    console.log("nigga", fields);
    fields.map((item) => {
      item.id = parseFloat(item.id);
      if (item.required) {
        item.required = parseFloat(item.required);
      }
      if (item.hidelable) {
        item.hidelabel = parseFloat(item.hidelabel);
      }
    });

    const message = {
      fields: fields,
      name: props.template.name,
      desc: props.template.form_desc,
      submit_text: props.template.submit_text,
      conf_message: props.template.conf_message,
      fid: props.template.fid,
    };

    Wix.Settings.closeWindow(message);
    setShowUseModal(false);
  };

  return (
    <div
      className={classes.template_container}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card className={classes.template_card}>
        <Card.Content>
          <Builder
            global={{
              name: props.template.name,
              description: props.template.form_desc,
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

      {hover && (
        <div className={classes.overlay}>
          <Button
            size="small"
            className={classes.overlay_button}
            onClick={() => {
              setShowUseModal(true);
            }}
          >
            Use Template
          </Button>
          <Button
            size="small"
            priority="secondary"
            className={classes.overlay_button}
            onClick={() => setShowMoreInfoModal(true)}
          >
            More Info
          </Button>
        </div>
      )}
      <Modal
        isOpen={showUseModal}
        onRequestClose={() => setShowUseModal(false)}
        shouldCloseOnOverlayClick
        screen="desktop"
      >
        <CustomModalLayout
          primaryButtonText="Use"
          primaryButtonOnClick={() => {
            handleConfirm();
          }}
          secondaryButtonText="Cancel"
          secondaryButtonOnClick={() => setShowUseModal(false)}
          onCloseButtonClick={() => setShowUseModal(false)}
          title="Use Template"
          overflowY="none"
          content={
            <Box width="500px" direction="vertical" gap={3}>
              <Text>
                Reseting this form means that all data{" "}
                <strong>({props.entries} entries)</strong> collected by the form
                will be deleted immediately
              </Text>
              <Text>
                Because this action cannot be undone, you might want to consider
                exporting your data first
              </Text>
            </Box>
          }
        />
      </Modal>
      <Modal
        isOpen={showMoreInforModal}
        onRequestClose={() => setShowMoreInfoModal(false)}
        shouldCloseOnOverlayClick
        screen="desktop"
        className={classes.more_info_modal}
      >
        <CustomModalLayout
          primaryButtonText="Use"
          primaryButtonOnClick={() => {
            setShowMoreInfoModal(false);
            setShowUseModal(true);
          }}
          secondaryButtonText="Cancel"
          secondaryButtonOnClick={() => setShowMoreInfoModal(false)}
          onCloseButtonClick={() => setShowMoreInfoModal(false)}
          title={props.template.name}
          content={
            <Box direction="vertical" padding="20px">
              <Box direction="vertical" width="500px" padding="0px 30px">
                <Heading size="small">{props.template.desc}</Heading>
              </Box>

              <Card className={classes.more_info_template_card}>
                <Card.Content>
                  <Builder
                    global={{
                      description: props.template.form_desc,
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
            </Box>
          }
        />
      </Modal>
    </div>
  );
};

export default Template;
