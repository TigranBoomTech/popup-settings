import { Page, Box, EmptyState, Loader } from "@wix/design-system";
import React, { useEffect, useState } from "react";
import { getData } from "../../helpers/addons/data";
import { addon_urls } from "../../helpers/addons/urls";
import Addon from "./Addon/Addon";
import axios from "axios";
import classes from "./Addons.module.scss";
import { comp_id, instance } from "../../helpers/common";

const Addons = () => {
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState([]);
  const [premiumAddons, setPremiumAddons] = useState([]);
  const [addTo, setAddTo] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    getData(addon_urls).then((response) => {
      setAddons(response[0]);
      setUser(response[1]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user.addons?.length) {
      const addons = user.addons;
      let install = {};
      addons.map((item, key) => {
        Object.assign(install, { [item.name]: true });
      });
      setAddTo(install);
    }

    if (user.addons) {
      const addonsName = user.addons.map((addon) => addon.name);
      const premiumAddons = addons.filter(
        (addonItem) =>
          addonsName.includes(addonItem.name) && addonItem.allow_level === 1
      );
      setPremiumAddons(premiumAddons);
    }
  }, [user]);

  const premiumAddonsCount = addons.filter(
    (addOnItem) => addOnItem.allow_level === 1
  );

  const availableAddOnsCount =
    user.premium == "starter"
      ? 1 - premiumAddons.length
      : user.premium == "professional" || user.premium == "premiumboomform"
      ? 3 - premiumAddons.length
      : user.premium == "business"
      ? premiumAddonsCount.length - premiumAddons.length
      : 0;

  const handleAddon = (addOnItem) => {
    setSettingsReload(addOnItem);
    if (availableAddOnsCount > 0 && addOnItem.allow_level === 1) {
      setAddTo((prev) => ({
        ...prev,
        [addOnItem.name]: !prev[addOnItem.name],
      }));

      setUser((prev) => ({
        ...prev,
        addons: [...prev.addons, addOnItem],
      }));

      addOnItem.allow_level === 1
        ? setPremiumAddons((prev) => [...prev, addOnItem])
        : null;

      addOnItem.installs++;

      const pushData = {
        instance: instance,
        name: addOnItem.name,
      };

      const headers = {
        headers: { PLATFORM: "_WIX" },
      };

      setLoading(true);
      axios
        .post(import.meta.env.VITE_BOOMTECH_API + `/addons`, pushData, headers)
        .then(() => {
          const message = { reload: true };
          Wix.Settings.closeWindow(message);
        });
      setLoading(false);
    } else if (addOnItem.allow_level === 0) {
      setAddTo((prev) => ({
        ...prev,
        [addOnItem.name]: !prev[addOnItem.name],
      }));

      setUser((prev) => ({
        ...prev,
        addons: [...prev.addons, addOnItem],
      }));

      addOnItem.installs++;

      const pushData = {
        instance: instance,
        name: addOnItem.name,
      };

      const headers = {
        headers: { PLATFORM: "_WIX" },
      };
      setLoading(true);
      axios
        .post(import.meta.env.VITE_BOOMTECH_API + `/addons`, pushData, headers)
        .then(() => {
          const message = { reload: true };
          Wix.Settings.closeWindow(message);
        });
      setLoading(false);
    } else {
      redirectToUpgrade();
    }
  };

  const handleRemoveAddon = (addOnItem) => {
    setAddTo((prev) => ({
      ...prev,
      [addOnItem.name]: false,
    }));

    setUser((prev) => ({
      ...prev,
      addons: prev.addons.filter((addon) => addon.name !== addOnItem.name),
    }));

    addOnItem.installs--;

    setPremiumAddons((prev) =>
      prev.filter((addon) => addon.name !== addOnItem.name)
    );

    const headers = {
      headers: { PLATFORM: "_WIX" },
    };

    axios.delete(
      import.meta.env.VITE_BOOMTECH_API +
        `/addon?instance=${instance}&name=${addOnItem.name}`,
      headers
    );
  };

  function setSettingsReload(addOnItem) {
    if (addOnItem.name === "Pagination") {
      Wix.Data.Public.set(
        "reloadSettings",
        true,
        { scope: "COMPONENT" },
        function (d) {},
        function (f) {}
      );
    }
  }
  const removeAddon = (addOnItem) => {
    if (addOnItem.name === "Pagination" || addOnItem.name === "Print") {
      axios.post(
        import.meta.env.VITE_BOOMTECH_API + `/addon`,
        {
          instance: instance,
          comp_id: comp_id,
          name: addOnItem.name,
          value: JSON.parse(addOnItem.default_value),
        },
        { headers: { PLATFORM: "_WIX" } }
      );
    }
    setSettingsReload(addOnItem);
  };

  return (
    <Page className={classes.addons_page}>
      <Page.Header title="Addons" size="large" />
      <Page.Content>
        {loading ? (
          <Box className={classes.addons_loader}>
            <Loader statusMessage="Uploading" />
          </Box>
        ) : addons.length > 0 ? (
          <Box className={classes.addons_layout}>
            {addons.map((addon, index) => {
              return (
                <Box key={index} className={classes.grid_item}>
                  <Addon
                    addon={addon}
                    installed={addTo[addon.name]}
                    handleAddon={handleAddon}
                    removeAddon={removeAddon}
                    handleRemoveAddon={handleRemoveAddon}
                  />
                </Box>
              );
            })}
          </Box>
        ) : (
          <EmptyState
            className={classes.empty_state}
            title="No Addons Found"
            subtitle="No available addons"
          />
        )}
      </Page.Content>
    </Page>
  );
};

export default Addons;
