const commonConditions = [
  "is",
  "is not",
  "contains",
  "starts with",
  "ends with",
];
const numericConditions = ["is", "is not", "greater than", "less than"];

export const conditions = {
  address: commonConditions,
  email: commonConditions,
  name: commonConditions,
  password: commonConditions,
  phone: commonConditions,
  textarea: commonConditions,
  text: commonConditions,

  scalerating: ["greater than", "less than"],
  starrating: ["greater than", "less than"],

  select: ["is", "is not"],
  radio: ["is", "is not"],

  terms: ["checked", "not Checked"],

  date: numericConditions,
  number: numericConditions,
  time: numericConditions,
  price: numericConditions,

  checkbox: [
    "checked",
    "not Checked",
    "checked more than",
    "checked equal to",
    "checked less than",
  ],
};

export const addressSubFields = [
  {
    label: "Street Address",
    value: "S",
  },
  {
    label: "Street Address 2",
    value: "S2",
  },
  {
    label: "City",
    value: "C",
  },
  {
    label: "State/Region",
    value: "St",
  },
  {
    label: "Postal/Zip Code",
    value: "P",
  },
  {
    label: "Country",
    value: "Co",
  },
];

export const nameSubFields = [
  {
    label: "First",
    value: "first",
  },
  {
    label: "Last",
    value: "last",
  },
];

export const emailTypes = [
  {
    label: "Notification email",
    value: "notification_email",
  },
  {
    label: "Confirmation email",
    value: "confirmation_email",
  },
];

export const notificationEmailTypes = [
  {
    value: "custom_email",
    label: "Custom Email",
  },
  {
    value: "form_emails",
    label: "Form Emails",
  },
];
