export const urlParams = new URLSearchParams(window.location.search);
export const path = urlParams.get("showType");

export const headers = {
  PLATFORM: "_WIX",
};

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const user_url =
  import.meta.env.VITE_BOOMTECH_API +
  `/option?comp_id=${Wix.Utils.getOrigCompId()}&instance=${getParameterByName(
    "instance"
  )}&locale=en`;
