import { getParameterByName, user_url } from "../common";

export const addons_url =
  import.meta.env.VITE_BOOMTECH_API +
  `/addons?instance=${getParameterByName("instance")}`;

export const addon_urls = [addons_url, user_url];
