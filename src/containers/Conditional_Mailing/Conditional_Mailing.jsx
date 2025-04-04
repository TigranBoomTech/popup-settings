import React, { useEffect, useState } from "react";
import axios from "axios";
import { headers, user_url } from "../../helpers/common";
import { debounce } from "../../helpers/conditional_mailing/debounce";
import { checkCondition } from "../../helpers/conditional_mailing/check_condition";
import { Page } from "@wix/design-system";
import classes from "./Conditional_Mailing.module.scss";

let count = 2;
const Conditional_Mailing = () => {
  const ignoredFields = ["website", "customHTML", "map", "file", "signature"];
  const [fieldsData, setFieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState([]);
  const [confirmationEmail, setConfirmationEmail] = useState(false);

  useEffect(() => {
    axios
      .get(user_url, headers)
      .then((response) => {
        const data = response.data;
        setLoading(false);
        setFieldsData(
          data.fields.filter((field) => !ignoredFields.includes(field.type))
        );
        const condEmail = data.addons.find(
          (addon) => addon.name === "ConditionalMailing"
        );
        const confEmail = data.addons.find(
          (addon) => addon.name === "ConfEmail"
        );
        if (condEmail?.value && condEmail?.value.length > 0) {
          setConditions(condEmail.value);
        }
        if (confEmail?.value?.confEmailType === 1) {
          setConfirmationEmail(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        throw error;
      });
  }, []);

  useEffect(() => {
    debounce(
      "update_condition",
      () => {
        const filteredConditions = conditions.map((condition) => {
          return { ...condition, isValid: checkCondition(condition) };
        });
        if (count) {
          return --count;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const comp_id = urlParams.get("origCompId");
        const instance = urlParams.get("instance");

        axios.post(
          import.meta.env.VITE_BOOMTECH_API + "/addon",
          {
            instance: instance,
            comp_id: comp_id,
            name: "ConditionalMailing",
            value: filteredConditions,
          },
          headers
        );
      },
      300
    );
  }, [conditions]);

  const addCondition = () => {
    setConditions((prev) => [...prev, { field: "", value: "", email: "" }]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => {
      return i !== index;
    });
    setConditions(updatedConditions);
  };

  const updateCondition = (data, index) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = data;
    setConditions(updatedConditions);
  };

  return (
    <Page className={classes.conditional_mailing_page}>
      <Page.Header title="Conditional Mailing" size="large" />
      <Page.Content></Page.Content>
    </Page>
  );
};

export default Conditional_Mailing;
