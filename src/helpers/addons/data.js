import axios from "axios";
import { headers } from "../common";

export const getData = async (urls) => {
  try {
    const responses = await Promise.all(
      urls.map((url) => axios.get(url, { headers }).then((res) => res.data))
    );
    return responses;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
