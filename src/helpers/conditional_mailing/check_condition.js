export const checkCondition = (condition) => {
  if (condition.toggleState === "custom_email") {
    if (
      condition.field &&
      condition.field !== "placeholder" &&
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        condition.email
      )
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};
