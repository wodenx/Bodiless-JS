// @ts-nocheck
import React from 'react';
import { Form, BasicText, asField } from 'informed';
const validate = (value: string | any[]) => {
  return !value || value.length < 5
    ? 'Field must be at least five characters'
    : undefined;
};
const ErrorText = ({ fieldState, ...props }) => (
  <React.Fragment>
    <BasicText
      fieldState={fieldState}
      {...props}
      style={fieldState.error ? { border: 'solid 1px red' } : {border: 'solid 1px black'}}
    />
    {fieldState.error ? (
      <small style={{ color: 'red' }}>{fieldState.error}</small>
    ) : null}
  </React.Fragment>
);

const InformedReactTag = asField(ErrorText);
const MyFormTest = () => (
  <Form>
    <label>
      First name:
      <InformedReactTag
        field="name"
        validate={validate}
        validateOnChange
        validateOnBlur
      />
    </label>
    <button type="submit">Submit</button>
  </Form>
);

export  {MyFormTest, InformedReactTag};
