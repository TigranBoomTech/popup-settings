import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Cell,
  Layout,
  MarketingPageLayout,
  MarketingPageLayoutContent,
  Text,
  Checkbox,
  Search,
  RadioGroup,
} from "@wix/design-system";
import urls from "./utils/urls";
import { getData } from "./utils/helpers";
import Template from "./Template/Template";
import classes from "./Templates.module.scss";
import {
  form_type_options,
  industry_options,
  sort_options,
} from "./utils/options";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [user, setUser] = useState({});
  //   const [sort, setSort] = useState("Name");

  useEffect(() => {
    getData(urls).then((response) => {
      setTemplates(response[0]);
      setUser(response[1]);
    });
  }, []);

  //   useEffect(() => {
  //     console.log(sort);
  //   }, [sort]);

  return (
    <Card className={classes.templates_card}>
      <MarketingPageLayout
        removeImageHorizontalPadding
        removeImageVerticalPadding
        verticalAlign="middle"
        className={classes.marketing_layout}
        content={
          <Box width="300px" height="540px" verticalAlign="middle">
            <MarketingPageLayoutContent
              size="large"
              title="Everything You Need To Get Started Quickly"
              content={
                <Box direction="vertical">
                  <Text size="medium" className={classes.header_description}>
                    Find a template that matches you business best, add your
                    touch and make it yours.
                  </Text>
                  <Search />
                  <Box gap="10">
                    <Box direction="vertical">
                      <Text weight="bold" className={classes.industry_filter}>
                        Browse by Industry
                      </Text>
                      <Box direction="vertical" className={classes.filters_box}>
                        {industry_options.map((type) => {
                          return (
                            <Checkbox id={type.id} size="medium">
                              {type.value}
                            </Checkbox>
                          );
                        })}
                      </Box>
                    </Box>
                    <Box direction="vertical">
                      <Text weight="bold" className={classes.form_type_filter}>
                        Browse by Form Type
                      </Text>
                      <Box direction="vertical" className={classes.filters_box}>
                        {form_type_options.map((type) => {
                          return (
                            <Checkbox id={type.id} size="medium">
                              {type.value}
                            </Checkbox>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                  <Box direction="vertical">
                    <Text weight="bold" className={classes.sort_filter}>
                      Sort By
                    </Text>
                    <Box direction="vertical" className={classes.sort_box}>
                      <RadioGroup>
                        {sort_options.map((type) => {
                          return (
                            <RadioGroup.Radio value={type.id}>
                              {type.value}
                            </RadioGroup.Radio>
                          );
                        })}
                      </RadioGroup>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Box>
        }
        image={
          <Box
            height="640px"
            overflow="scroll"
            style={{ maxHeight: "640px", scrollbarWidth: "none" }}
          >
            <Layout>
              {templates.length > 0 ? (
                templates.map((template) => (
                  <Cell span={6}>
                    <Template
                      template={template}
                      isUserPremium={user.premium}
                    />
                  </Cell>
                ))
              ) : (
                <div>No templates available</div>
              )}
            </Layout>
          </Box>
        }
      />
    </Card>
  );
};

export default Templates;
