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
  Loader,
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
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [user, setUser] = useState({});
  const [sort, setSort] = useState("");
  const [industry, setIndustry] = useState([]);
  const [formType, setFormType] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getData(urls).then((response) => {
      setTemplates(response[0]);
      setFilteredTemplates(response[0]);
      setUser(response[1]);
    });
  }, []);

  const filterTemplates = () => {
    let updatedTemplates = [...templates];

    // Apply search filter
    if (searchQuery) {
      updatedTemplates = updatedTemplates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply industry filter
    if (industry.length > 0) {
      updatedTemplates = updatedTemplates.filter((template) =>
        industry.includes(template.industry)
      );
    }

    // Apply form type filter
    if (formType.length > 0) {
      updatedTemplates = updatedTemplates.filter((template) =>
        formType.includes(template.formType)
      );
    }

    // Apply sorting
    if (sort) {
      updatedTemplates.sort((a, b) => {
        if (sort === "Name") return a.name.localeCompare(b.name);
        if (sort === "Industry") return a.industry.localeCompare(b.industry);
        return 0;
      });
    }

    setFilteredTemplates(updatedTemplates);
  };

  useEffect(() => {
    filterTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, industry, formType, searchQuery, templates]);

  const handleIndustryChagne = (id) => {
    setIndustry((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFormTypeChange = (id) => {
    setFormType((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
              className={classes.marketing_content_layout}
              content={
                <Box direction="vertical">
                  <Text size="medium" className={classes.header_description}>
                    Find a template that matches you business best, add your
                    touch and make it yours.
                  </Text>
                  <Search
                    placeholder="Search templates ..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Box gap="10">
                    <Box direction="vertical">
                      <Text weight="bold" className={classes.industry_filter}>
                        Browse by Industry
                      </Text>
                      <Box
                        gap="1"
                        direction="vertical"
                        className={classes.filters_box}
                      >
                        {industry_options.map((type) => {
                          return (
                            <Checkbox
                              key={type.id}
                              id={type.id}
                              size="medium"
                              checked={industry.includes(type.value)}
                              onChange={() => handleIndustryChagne(type.value)}
                            >
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
                      <Box
                        gap="1"
                        direction="vertical"
                        className={classes.filters_box}
                      >
                        {form_type_options.map((type) => {
                          return (
                            <Checkbox
                              key={type.id}
                              id={type.id}
                              size="medium"
                              checked={formType?.includes(type.value)}
                              onChange={() => handleFormTypeChange(type.value)}
                            >
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
                      <RadioGroup
                        value={sort}
                        onChange={(option) => setSort(option)}
                      >
                        {sort_options.map((type) => {
                          return (
                            <RadioGroup.Radio value={type.value}>
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
            style={{
              maxHeight: "640px",
              scrollbarWidth: "none",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Layout alignItems="center" justifyItems="center">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Cell span={6}>
                    <Template
                      template={template}
                      isUserPremium={user.premium}
                    />
                  </Cell>
                ))
              ) : (
                <Cell span={12}>
                  <Loader />
                </Cell>
              )}
            </Layout>
          </Box>
        }
      />
    </Card>
  );
};

export default Templates;
