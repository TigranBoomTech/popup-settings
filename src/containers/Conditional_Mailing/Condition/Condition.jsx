import React, { useEffect } from "react";
import {
  conditions,
  addressSubFields,
  nameSubFields,
  emailTypes,
  notificationEmailTypesF,
} from "../../../helpers/conditional_mailing/options";

const Condition = ({
  index,
  isLast,
  fields,
  condition,
  addCondition,
  removeCondition,
  updateCondition,
  conditionsLength,
  confirmationEmail,
}) => {
  const [fieldValue, setFieldValue] = useState(condition.value);
  const [sendEmail, setSendEmail] = useState(condition.email);

  // -----------------------------------------------------------

  const [toggleState, setToggleState] = useState(condition.toggleState);
  const [selectedEmailType, setSelectedEmailType] = useState(
    condition.emailType
  );
  const [emailFields, setEmailFields] = useState([]);
  const [formEmail, setFormEmail] = useState(condition.formEmail);

  // -----------------------------------------------------------

  const [selectedField, setSelectedField] = useState({
    id: condition.field,
    type: condition.type,
  });

  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedSubField, setSelecteSubField] = useState(condition.subField);
  const [selectedCondition, setSelectedCondition] = useState(
    condition.condition
  );
  const [matchedConditions, setMatchedConditions] = useState([]);

  useEffect(() => {
    if (selectedField.id) {
      const options =
        fields.find((field) => field.id === selectedField.id)?.options || [];
      setFieldOptions(options);
    }
    setEmailFields(fields.filter((field) => field.type === "email"));
  }, []);

  useEffect(() => {
    if (selectedSubField === "country") {
      setMatchedConditions(conditions.select);
    } else {
      setMatchedConditions(conditions[selectedField.type]);
    }
  }, [selectedField.type, selectedSubField]);

  useEffect(() => {
    updateCondition(
      {
        field: selectedField.id,
        subField: selectedSubField || "",
        toggleState: toggleState,
        emailType: selectedEmailType || "",
        formEmail: formEmail,
        type: selectedField.type,
        email: sendEmail,
        value: fieldValue,
        condition: selectedCondition,
      },
      index
    );
  }, [
    selectedField,
    selectedSubField,
    sendEmail,
    fieldValue,
    selectedCondition,
    toggleState,
    selectedEmailType,
    formEmail,
  ]);

  const handleEmailChange = (e) => {
    setSendEmail(e.target.value);
  };

  const handleToggle = (type) => {
    setToggleState(type);
  };

  const handleEmailTypeChange = (e) => {
    setSelectedEmailType(e.target.value);
  };

  const handleFormEmailChange = (e) => {
    const value = e.target.value;
    const field = emailFields[value];
    const { id } = field;
    setFormEmail(id);
  };

  const handleFieldChange = (e) => {
    const value = e.target.value;
    const field = fields[value];
    const { id, options = [], type } = field;

    let fieldType = type;

    if (type === "checkbox" && field.fieldName === "terms") {
      fieldType = "terms";
    }

    if (options) {
      setSelectedSubField("");
      setFieldOptions([]);
      setSelectedField({ id, options, type: fieldType });
    } else {
      setSelectedCondition({ id, type: fieldType });
    }
  };

  const handleSubFieldChange = (e) => {
    setSelectedSubField(e.target.value);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  return <div>Hello Nigga</div>;
};

export default Condition;
