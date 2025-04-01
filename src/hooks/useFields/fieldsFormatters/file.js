import {
  getFieldClassnames,
  getFieldInstruction,
  getFieldLabel,
  getFieldValidation,
  getFieldWidth,
} from "../helpers";

export const file = ({ field, messages }) => {
  const { id, multiple, fileTypes } = field;

  const formatedField = {
    type: "file",
    id,
    isMultiple: multiple || false,
    classnameprefix: getFieldClassnames(field),
    instruction: getFieldInstruction(field),
    validation: getFieldValidation(field, messages),
    width: getFieldWidth(field),
    uploadOptions: (file) => [
      {
        url: "https://storage.apiboomtech.com/file",
        retries: 3,
        headers: {
          Authorization:
            "Bearer sl.BZX4eUyGRmCoRR3lAjokvL5UB6Y5sV_q8BT--zff_WTRwUa_xkIe38R6DxgN_Lqqb5KtIf5GvoiIGi2ml6ZPPSXAX7unkglCKrNysIVFt8shT3pXl9JbdUXyMSTi_92RFZmr8pI",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
        formatBeforeSend: () => {
          const formatedFiles = new FormData();
          formatedFiles.append("file", file);
          return formatedFiles;
        },
        queries: {
          platform: "wix",
          // eslint-disable-next-line no-undef
          folder: Wix.Utils.getInstanceId(),
        },
      },
      {
        url: `${import.meta.env.VITE_BOOMTECH_API}/uploadToGoogleCloud`,
        method: "POST",
        retries: 3,
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
        formatBeforeSend: () => {
          const formatedFiles = new FormData();
          formatedFiles.append("file", file);
          return formatedFiles;
        },
        queries: {
          // eslint-disable-next-line no-undef
          folder: "wix_uploads/" + Wix.Utils.getInstanceId(),
          fileName: file.name,
        },
      },
    ],
    ...getFieldLabel(field),
  };

  if (fileTypes) formatedField.accept = fileTypes.toLowerCase();
  return formatedField;
};

export const fileValue = ({ id, value, formatedValues }) => {
  const newFile = [];
  if (formatedValues["files"] === undefined) formatedValues["files"] = [];
  for (let i in value) {
    const curFile = {
      name: value[i].originalName || value[i].name,
      size: value[i].size,
      path:
        value[i]?.responce?.data?.path ||
        // eslint-disable-next-line no-undef
        "/" + Wix.Utils.getInstanceId() + "/" + value[i].name,
    };
    formatedValues["files"].push(curFile);
    newFile.push(curFile);
  }
  formatedValues[`field${id}`] = newFile;
};
