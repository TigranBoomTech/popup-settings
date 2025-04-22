import React, { useEffect, useState } from "react";
import axios from "axios";
import { getParameterByName, headers, user_url } from "../../helpers/common";
import { debounce } from "../../helpers/conditional_mailing/debounce";
import { checkCondition } from "../../helpers/conditional_mailing/check_condition";
import {
  AddItem,
  Box,
  Cell,
  EmptyState,
  Layout,
  Loader,
  Page,
  TextButton,
} from "@wix/design-system";
import Condition from "./Condition/Condition";
import { nanoid } from "nanoid";
import { Add } from "@wix/wix-ui-icons-common";
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
          const patchedConditions = condEmail.value.map((cond) => ({
            ...cond,
            id: cond.id || nanoid(),
          }));
          setConditions(patchedConditions);
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

        axios.post(
          import.meta.env.VITE_BOOMTECH_API + "/addon",
          {
            instance: getParameterByName("instance"),
            comp_id: Wix.Utils.getOrigCompId(),
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
    let tempConditions = [...conditions];
    tempConditions.push({ id: nanoid(), field: "", value: "", email: "" });
    setConditions(tempConditions);
  };

  const removeCondition = (id) => {
    const updatedConditions = conditions.filter((condition) => {
      return condition.id !== id;
    });
    setConditions(updatedConditions);
  };

  const updateCondition = (data, id) => {
    const updatedConditions = conditions.map((condition) =>
      condition.id === id ? { ...condition, ...data } : condition
    );
    setConditions(updatedConditions);
  };

  return (
    <Page className={classes.conditional_mailing_page}>
      <Page.Header
        title="Conditional Mailing"
        subtitle="Customize form communication effortlessly with Conditional Mailing.
            This addon allows administrators to set conditions based on user
            input, ensuring tailored email notifications for specific scenarios."
        size="large"
      />
      <Page.Content>
        <Box maxWidth="800px"></Box>
        {loading ? (
          <Box className={classes.conditional_mailing_layout}>
            <Loader statusMessage="Uploading"></Loader>
          </Box>
        ) : conditions.length > 0 ? (
          <Layout>
            {conditions.map((condition, index) => {
              return (
                <Cell span={4} key={condition.id}>
                  <Condition
                    index={index}
                    fields={fieldsData}
                    condition={condition}
                    removeCondition={removeCondition}
                    updateCondition={updateCondition}
                    confirmationEmail={confirmationEmail}
                  />
                </Cell>
              );
            })}
            <Cell span={4}>
              <Box width="100%" height="540px">
                <AddItem size="small" onClick={() => addCondition()}>
                  Add New Condition
                </AddItem>
              </Box>
            </Cell>
          </Layout>
        ) : (
          <Box width="100%" direction="vertical" gap={10}>
            <EmptyState
              className={classes.empty_state}
              title="There are no conditions yet"
              subtitle="Add your first condition !"
            >
              <TextButton
                prefixIcon={<Add />}
                onClick={() => {
                  addCondition();
                }}
              >
                Add Condition
              </TextButton>
            </EmptyState>
          </Box>
        )}
      </Page.Content>
    </Page>
  );
};

export default Conditional_Mailing;
