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
} from "@wix/design-system";
import classes from "./Conditional_Mailing.module.scss";
import Condition from "./Condition/Condition";

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
    tempConditions.unshift({ field: "", value: "", email: "" });
    setConditions(tempConditions);
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
            <Cell span={4}>
              <Box width="100%" height="560px">
                <AddItem size="small" onClick={() => addCondition()}>
                  Add New Condition
                </AddItem>
              </Box>
            </Cell>
            {conditions.map((condition, index) => {
              return (
                <Cell span={4} key={`condition_${index}_${conditions.length}`}>
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
          </Layout>
        ) : (
          <Box width="100%" direction="vertical" gap={10}>
            <AddItem size="small" onClick={() => addCondition()}>
              Add New Condition
            </AddItem>
            <EmptyState
              title="There are no conditions yet"
              subtitle="Add your first condition !"
            />
          </Box>
        )}
      </Page.Content>
    </Page>
  );
};

export default Conditional_Mailing;
