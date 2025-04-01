import React, { useLayoutEffect, useRef } from "react";
import config from "../../helpers/mail_editor/default_config";
import classes from "./MailEditor.module.scss";

const Mail_Editor = () => {
  const iframeRef = useRef(null);
  const params = new URLSearchParams(window.location.search);

  useLayoutEffect(() => {
    const handleMessage = (message) => {
      const receivedMessage = message.data;

      if (receivedMessage.type === "CLOSE_AND_SAVE") {
        Wix.Settings.closeWindow({
          html: message.data.html,
          json: message.data.json,
        });
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendDataToIframe = () => {
    if (iframeRef.current) {
      const defaultConfig = params.get("defaultConfig");
      const fields = params.get("fields");

      iframeRef.current.contentWindow.postMessage(
        {
          type: "CUSTOM_NOTIFICATION",
          platform: "WIX",
          defaultConfig: defaultConfig ? JSON.parse(defaultConfig) : config,
          fields: fields ? JSON.parse(fields) : [],
        },
        "*"
      );
    }
  };

  return (
    <div className={classes.mail_editor_container}>
      <iframe
        ref={iframeRef}
        src="https://form.boomte.ch/email_editor/"
        title="emailEditorIframe"
        onLoad={sendDataToIframe}
        width="100%"
        height="100%"
        style={{ border: "none", borderRadius: "16px" }}
        scrolling="no"
      />
    </div>
  );
};

export default Mail_Editor;
