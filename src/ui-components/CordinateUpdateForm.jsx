/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Cordinate } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function CordinateUpdateForm(props) {
  const {
    id: idProp,
    cordinate: cordinateModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    x: "",
    y: "",
  };
  const [x, setX] = React.useState(initialValues.x);
  const [y, setY] = React.useState(initialValues.y);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = cordinateRecord
      ? { ...initialValues, ...cordinateRecord }
      : initialValues;
    setX(cleanValues.x);
    setY(cleanValues.y);
    setErrors({});
  };
  const [cordinateRecord, setCordinateRecord] =
    React.useState(cordinateModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Cordinate, idProp)
        : cordinateModelProp;
      setCordinateRecord(record);
    };
    queryData();
  }, [idProp, cordinateModelProp]);
  React.useEffect(resetStateValues, [cordinateRecord]);
  const validations = {
    x: [{ type: "Required" }],
    y: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          x,
          y,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            Cordinate.copyOf(cordinateRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "CordinateUpdateForm")}
      {...rest}
    >
      <TextField
        label="X"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={x}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              x: value,
              y,
            };
            const result = onChange(modelFields);
            value = result?.x ?? value;
          }
          if (errors.x?.hasError) {
            runValidationTasks("x", value);
          }
          setX(value);
        }}
        onBlur={() => runValidationTasks("x", x)}
        errorMessage={errors.x?.errorMessage}
        hasError={errors.x?.hasError}
        {...getOverrideProps(overrides, "x")}
      ></TextField>
      <TextField
        label="Y"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={y}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              x,
              y: value,
            };
            const result = onChange(modelFields);
            value = result?.y ?? value;
          }
          if (errors.y?.hasError) {
            runValidationTasks("y", value);
          }
          setY(value);
        }}
        onBlur={() => runValidationTasks("y", y)}
        errorMessage={errors.y?.errorMessage}
        hasError={errors.y?.hasError}
        {...getOverrideProps(overrides, "y")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || cordinateModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || cordinateModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
