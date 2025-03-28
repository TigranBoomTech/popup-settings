export const getData = async (urls) => {
  try {
    const response = await Promise.all(
      urls.map((url) =>
        fetch(url, { headers: { PLATFORM: "_WIX" } }).then((res) => res.json())
      )
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
