import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Field, Formik, Form, FieldProps } from "formik";

import { TextField, DiagnosisSelection } from "./FormField";
import { Diagnosis, Entry, HealthCheckRating } from "../types";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { assertNever, isDate } from "../utils";

export type EntryFormValues = Entry;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

interface FormProps {
    diagnosisCodes: Diagnosis[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void,
    onCancel: () => void,
    dirty: boolean,
    isValid: boolean,
    values: Entry,
    type: string,
    setType: React.Dispatch<React.SetStateAction<string>>,
    children: React.ReactNode
}


const EntryForm = ({ diagnosisCodes, setFieldValue, setFieldTouched, onCancel, dirty, isValid, type, setType, children }: FormProps) => {
    const onChange = (e: { target: { value: string; }; }) => {    
        setType(e.target.value);
        setFieldTouched('type', true);
        setFieldValue('type', e.target.value);
    };
    return (
    <Form className="form ui">
        <InputLabel>Type</InputLabel>
        <Field
            fullWidth
            style={{ marginBottom: "0.5em" }}
            name="type"
            component={Select}
            onChange={onChange}
            value={type}
        >
        {["Hospital", "HealthCheck", "OccupationalHealthcare"].map((option) => (
            <MenuItem key={option} value={option}>
            {option}
            </MenuItem>
        ))}
        </Field>
        <Field
            label="Description"
            placeholder="description"
            name="description"
            component={TextField}
        />
        <Field
            label="Date"
            placeholder="Date"
            name="date"
            component={TextField}
        />
        <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
        />
        <DiagnosisSelection
            diagnoses={diagnosisCodes}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
        />
        {children}
        <Grid>
            <Grid item>
            <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
            >
                Cancel
            </Button>
            </Grid>
            <Grid item>
            <Button
                style={{
                float: "right",
                }}
                type="submit"
                variant="contained"
                disabled={!dirty || !isValid}
            >
                Add
            </Button>
            </Grid>
        </Grid>
    </Form>
    );
};

// props for select field component
type SelectFieldProps = {
    name: string;
    label: string;
    options: HealthCheckRating[];
};
  
  const FormikSelect = ({ field, ...props }: FieldProps) => <Select {...field} {...props} />;
  
  const SelectField = ({ name, label, options }: SelectFieldProps) => (
    <>
      <InputLabel>{label}</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        label={label}
        component={FormikSelect}
        name={name}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {HealthCheckRating[option]}
          </MenuItem>
        ))}
      </Field>
    </>
  );


const AddPatientEntryForm = ({ onSubmit, onCancel }: Props) => {
    const { id } = useParams<{ id : string}>();
    const [{ diagnosisCodes }] = useStateValue();
    const [type, setType] = useState<string>("Hospital");
    const healthCheckOptions = (Object.values(HealthCheckRating)  as HealthCheckRating[]).filter(n => typeof n !== 'string');
    if(!id) {
        return <></>;
    }
    const initialValues : Entry = {
        id: id,
        type: "Hospital",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        // "Hospital"
        discharge: { date: "", criteria: "" },
        // "OccupationalHealthcare"
        employerName: "",
        sickLeave : { startDate: "", endDate: "" },
        // "HealthCheck"
        healthCheckRating: 0
    } as Entry;
    return <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => {
            const requiredError = "Field is required";
            const invalidDateError = "invalid Date";
            const errors: { [field: string]: string } = {};
            if (!values.description) {
                errors.description = requiredError;
            }
            if (!values.date) {
                errors.date = requiredError;
            }
            if(!isDate(values.date)) {
                errors.date = invalidDateError;
            }
            if (!values.specialist) {
                errors.specialist = requiredError;
            }
            switch(values.type) {
                case "Hospital":
                    if (!values.discharge?.criteria) {
                        errors.dischargeCriteria = requiredError;
                    }
                    if (!values.discharge?.date) {
                        errors.dischargeDate = requiredError;
                    }
                    if(values.discharge?.date && !isDate(values.discharge.date)) {
                        errors.dischargeDate = invalidDateError;
                    }
                    break;
                case "HealthCheck":
                    if (!values.healthCheckRating) {
                        errors.healthCheckRating = requiredError;
                    }
                    break;
                case "OccupationalHealthcare":
                    if (!values.employerName) {
                        errors.employerName = requiredError;
                    }
                    if(values.sickLeave && !isDate(values.sickLeave.startDate)) {
                        errors.sickLeaveStartDate = invalidDateError;
                    }
                    if(values.sickLeave && !isDate(values.sickLeave.endDate)) {
                        errors.sickLeaveEndDate = invalidDateError;
                    }
                    break;
                default:
                    errors.type = "unknown type";
            }
            return errors;
        }}
    >
    {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        switch(values.type) {
            case  "Hospital":
                return <EntryForm
                    diagnosisCodes={diagnosisCodes}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onCancel={onCancel}
                    dirty={dirty}
                    isValid={isValid}
                    values={values}
                    type={type}
                    setType={setType}
                    >
                        <Field
                        label="Discharge date"
                        placeholder="Discharge date"
                        name="discharge.date"
                        component={TextField}
                        />
                        <Field
                            label="Discharge criteria"
                            placeholder="Discharge criteria"
                            name="discharge.criteria"
                            component={TextField}
                        />
                    </EntryForm>;
            case "HealthCheck":
                return <EntryForm
                    diagnosisCodes={diagnosisCodes}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onCancel={onCancel}
                    dirty={dirty}
                    isValid={isValid}
                    values={values}
                    type={type}
                    setType={setType}
                    >
                        <SelectField
                        label="healthCheckRating"
                        name="healthCheckRating"
                        options={healthCheckOptions}
                        />
                    </EntryForm>;
            case "OccupationalHealthcare":
                return <EntryForm
                    diagnosisCodes={diagnosisCodes}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onCancel={onCancel}
                    dirty={dirty}
                    isValid={isValid}
                    values={values}
                    type={type}
                    setType={setType}
                    >
                        <Field
                            label="Employer Name"
                            placeholder="Employer Name"
                            name="employerName"
                            component={TextField}
                        />
                        <Field
                            label="Sick leave start date"
                            placeholder="Sick leave start date"
                            name="sickLeave.startDate"
                            component={TextField}
                        />
                        <Field
                            label="Sick leave end date"
                            placeholder="Sick leave end date"
                            name="sickLeave.endDate"
                            component={TextField}
                        />
                    </EntryForm>;
            default:
                return assertNever(values);
        }
        return <></>;
    }}
    </Formik>;
};


export default AddPatientEntryForm;