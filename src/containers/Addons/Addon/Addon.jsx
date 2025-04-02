import {
  Box,
  Button,
  Card,
  CustomModalLayout,
  Image,
  Modal,
  Text,
} from "@wix/design-system";
import React, { useState } from "react";
import classes from "./Addon.module.scss";
import {
  Download,
  PremiumFilled,
  StarFilled,
  ConfirmSmall,
} from "@wix/wix-ui-icons-common";

const Addon = ({ addon, installed }) => {
  const [hover, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const decodeHTMLEntities = (text) => {
    let textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  return (
    <div
      className={classes.addon_container}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card className={classes.addon_card}>
        <Box direction="vertical" className={classes.addon_card_content}>
          <Box direction="vertical" className={classes.addon_card_image}>
            <Image
              src={`https://form.boomte.ch/images/addons/${addon.img}`}
              borderRadius="50%"
              height="55px"
              width="55px"
            />
          </Box>

          <Box
            direction="vertical"
            gap="5px"
            className={classes.addon_card_header}
          >
            <Text weight="bold" className={classes.addon_title}>
              {decodeHTMLEntities(addon.title)}
            </Text>
            <Text className={classes.addon_short_desc}>
              {decodeHTMLEntities(addon.description)}
            </Text>
          </Box>

          <Box className={classes.premium_free_block}>
            {addon.allow_level ? (
              <Box gap="10px">
                <PremiumFilled color="#9A27DD" />
                <Text skin="premium">Premium</Text>
              </Box>
            ) : (
              <Text skin="success">Free</Text>
            )}
          </Box>

          <Box
            direction="vertical"
            className={classes.addon_card_footer}
            gap="10px"
          >
            <Card.Divider />
            <Box justifyContent="space-between" alignItems="center">
              {addon.installs < 50 ? (
                <Box alignItems="center" gap="5px">
                  <StarFilled size="20px" color="#FFD700" />
                  <Text>New</Text>
                  <StarFilled size="20px" color="#FFD700" />
                </Box>
              ) : (
                <Box alignItems="center" gap="5px">
                  <Download size="20px" />
                  <Text>{addon.installs}</Text>
                </Box>
              )}
              {installed && (
                <Box aligntItems="center" gap="5px">
                  <ConfirmSmall size="25px" color="#28a745" />
                  <Text>Installed</Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      {hover && (
        <div className={classes.overlay}>
          <Card className={classes.overlay_card}>
            <Card.Content className={classes.overlay_card_content}>
              <Box direction="vertical" gap="15px">
                <Box direction="vertical" gap="10px">
                  <Text weight="bold">{decodeHTMLEntities(addon.title)}</Text>
                  {addon.name === "WixDataSet" ? (
                    <Text size="small">
                      Wix Code is an integrated developing platform that lets
                      you create your own database. Using this addon you will be
                      able to integrate your Boom Form with Wix Code and store
                      your form entries to Wix database.
                    </Text>
                  ) : (
                    <Text size="small">
                      {decodeHTMLEntities(addon.fullDesc)}
                    </Text>
                  )}
                </Box>
                {installed ? (
                  <Button
                    size="tiny"
                    skin="destructive"
                    onClick={() => setShowModal(true)}
                    style={{ width: "120px" }}
                  >
                    Uninstall
                  </Button>
                ) : (
                  <Button size="tiny" style={{ width: "120px" }}>
                    Add To Site
                  </Button>
                )}
              </Box>
            </Card.Content>
          </Card>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        shouldCloseOnOverlayClick
        screen="desktop"
      >
        <CustomModalLayout
          theme="destructive"
          primaryButtonText="Delete"
          primaryButtonOnClick={() => setShowModal(false)}
          secondaryButtonText="Cancel"
          secondaryButtonOnClick={() => setShowModal(false)}
          onCloseButtonClick={() => setShowModal(false)}
          title="Are you sure ?"
          overflowY="none"
          content={
            <Text>
              If you remove this addon, all your settings will be lost
            </Text>
          }
        />
      </Modal>
    </div>
  );
};

export default Addon;
