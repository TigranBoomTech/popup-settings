import { instance, user_url } from "../common";

export const templates_url =
  import.meta.env.VITE_BOOMTECH_API + `/templates?instance=${instance}`;

export const template_urls = [templates_url, user_url];
