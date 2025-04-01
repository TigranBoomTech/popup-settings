const urlParams = new URLSearchParams(window.location.search);
const comp_id = urlParams.get("origCompId");
const instance = urlParams.get("instance");

const templates_url =
  import.meta.env.VITE_BOOMTECH_API + `/templates?instance=${instance}`;
const user_url =
  import.meta.env.VITE_BOOMTECH_API +
  `/option?comp_id=${comp_id}&instance=${instance}&locale=en`;
const urls = [templates_url, user_url];

export default urls;
