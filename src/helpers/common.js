export const urlParams = new URLSearchParams(window.location.search);

export const path = urlParams.get("showType");

export const comp_id = urlParams.get("origCompId");

export const instance = urlParams.get("instance");

export const headers = {
  PLATFORM: "_WIX",
}; 

export const user_url =
  import.meta.env.VITE_BOOMTECH_API +
  `/option?comp_id=${comp_id}&instance=${instance}&locale=en`;
