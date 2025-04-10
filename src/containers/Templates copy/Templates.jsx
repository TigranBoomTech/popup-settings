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
  EmptyState,
  Image,
  Loader,
} from "@wix/design-system";
import { getData } from "../../helpers/templates/data";
import { template_urls } from "../../helpers/templates/urls";
import Template from "./Template/Template";
import classes from "./Templates.module.scss";
import {
  form_type_options,
  industry_options,
  sort_options,
} from "../../helpers/templates/options";
import { ContentFilterSmall } from "@wix/wix-ui-icons-common";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [user, setUser] = useState({});
  const [sort, setSort] = useState("");
  const [industries, setIndustries] = useState([]);
  const [formTypes, setFormTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPanel, setFilterPanel] = useState(-600);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(template_urls).then((response) => {
      setTemplates(response[0]);
      setFilteredTemplates(response[0]);
      setUser(response[1]);
      setLoading(false);
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
    setFilterPanel(0);
  };

  const closePanel = () => {
    setFilterPanel(-600);
  };

  return (
    <div className={classes.templates_container}>
      <Page className={classes.templates_page}>
        <Page.Header
          title="Templates"
          subtitle="Evetything you need to get started quickly․"
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
          {loading ? (
            <Box className={classes.templates_loader}>
              <Loader statusMessage="Uploading" />
            </Box>
          ) : filteredTemplates.length > 0 ? (
            <Layout>
              {filteredTemplates.map((template) => {
                return (
                  <Cell span={4}>
                    <Template
                      key={template.id}
                      isUserPremium={user.premium}
                      entries={user.subs}
                      template={template}
                    />
                  </Cell>
                );
              })}
            </Layout>
          ) : (
            <EmptyState
              className={classes.empty_state}
              title="No Templates Found"
              subtitle="Try adjusting your filters"
            />
          )}
        </Page.Content>
      </Page>
      <div
        className={classes.templates_side_panel_container}
        style={{
          right: `${filterPanel}px`,
        }}
      >
        <SidePanel title="Filter" onCloseButtonClick={closePanel}>
          <SidePanel.Header title="Filter" />
          <SidePanel.Content>
            {filteredTemplates.length > 0 ? (
              <>
                {" "}
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
              </>
            ) : (
              <EmptyState title="No Templates Found" />
            )}
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
