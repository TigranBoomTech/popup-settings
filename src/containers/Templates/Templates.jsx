import React, { useState, useEffect } from "react";
import {
  Box,
  Cell,
  Layout,
  Text,
  Checkbox,
  Search,
  RadioGroup,
  Page,
  Button,
  SidePanel,
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
import { ContentFilterSmall } from "@wix/wix-ui-icons-common";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [user, setUser] = useState({});
  const [sort, setSort] = useState("");
  const [industries, setIndustries] = useState([]);
  const [formTypes, setFormTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [right, setRight] = React.useState(-440);

  useEffect(() => {
    getData(urls).then((response) => {
      setTemplates(response[0]);
      setFilteredTemplates(response[0]);
      setUser(response[1]);
    });
  }, []);

  const filterTemplates = () => {
    let updatedTemplates = [...templates];

    if (searchQuery) {
      updatedTemplates = updatedTemplates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (industries.length > 0) {
      updatedTemplates = updatedTemplates.filter((template) =>
        industries.some((industry) => template.industry.includes(industry))
      );
    }

    if (formTypes.length > 0) {
      updatedTemplates = updatedTemplates.filter((template) =>
        formTypes.some((formType) => template.form_type.includes(formType))
      );
    }

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
  }, [sort, industries, formTypes, searchQuery, templates]);

  const handleIndustryChagne = (id) => {
    setIndustries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFormTypeChange = (id) => {
    setFormTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openPanel = () => {
    setRight(0);
  };

  const closePanel = () => {
    setRight(-440);
  };

  return (
    <div className={classes.templates_container}>
      <Page className={classes.templates_page}>
        <Page.Header
          title="Templates"
          size="large"
          actionsBar={
            <Button
              prefixIcon={<ContentFilterSmall />}
              onClick={() => {
                openPanel();
              }}
            >
              Filter
            </Button>
          }
        />
        <Page.Content>
          <Layout>
            {filteredTemplates.map((template) => {
              return (
                <Cell span={4}>
                  <Template isUserPremium={user.premium} template={template} />
                </Cell>
              );
            })}
          </Layout>
        </Page.Content>
      </Page>
      <div
        className={classes.templates_side_panel_container}
        style={{
          right: `${right}px`,
        }}
      >
        <SidePanel title="Filter" onCloseButtonClick={closePanel}>
          <SidePanel.Header title="Filter" />
          <SidePanel.Content>
            <Search
              placeholder="Search templates ..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Box gap="10" className={classes.filters_box}>
              <Box direction="vertical">
                <Text weight="bold" className={classes.industry_filter}>
                  Industry
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
                        checked={industries.includes(type.value)}
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
                  Form Type
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
                        checked={formTypes.includes(type.value)}
                        onChange={() => handleFormTypeChange(type.value)}
                      >
                        {type.value}
                      </Checkbox>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            <Box direction="vertical" className={classes.sort_box}>
              <Text weight="bold" className={classes.sort_filter}>
                Sort By
              </Text>
              <Box direction="vertical" className={classes.sort_box}>
                <RadioGroup value={sort} onChange={(option) => setSort(option)}>
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
          </SidePanel.Content>
          <SidePanel.Footer>
            <Button onClick={closePanel} priority="secondary" fullWidth>
              Close
            </Button>
          </SidePanel.Footer>
        </SidePanel>
      </div>
    </div>
  );
};

export default Templates;
