import React, { useState } from 'react';
import { Form, useField } from 'informed';
import ReactTags from 'react-tag-autocomplete';

const validate = (value: any) => {
  console.log(value, 'In informedRactAutoComplete Validate');
  return !value || value.length < 5
    ? 'Field must be at least five characters'
    : undefined;
};

// @ts-ignore
const NonInformedReactTag = props => {
  const [tags, setTags] = useState([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);
  // @ts-ignore
  const [suggestions, setSuggestions] = useState([
    { id: 3, name: 'Bananas' },
    { id: 4, name: 'Mangos' },
    { id: 5, name: 'Lemons' },
    { id: 6, name: 'Apricots' },
  ]);
  return (
    <>
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        noSuggestionsText={'No suggestions found'}
        handleDelete={i => {
          const newTags = tags.slice(0);
          newTags.splice(i, 1);
          setTags(newTags);
          console.log(newTags, 'in HandleDelete');
        }}
        handleAddition={tag => {
          // Needs to be wired into informed. Understand react forms tutorial use UseState react.
          // Do we need local state or not
          // @ts-ignore
          setTags([...tags, tag]);
        }}
      />
      <pre style={{ color: 'red', backgroundColor: 'black' }}>
        <code>{JSON.stringify({ tags }, null, 2)}</code>
      </pre>
    </>
  );
};

// @ts-ignore
const InformedReactTag = props => {
  // @ts-ignore
  const { render, informed, fieldState } = useField({
    fieldType: 'text',
    //  validate,
    ...props,
  });
  const [tags, setTags] = useState([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);
  // @ts-ignore
  const [suggestions, setSuggestions] = useState([
    { id: 3, name: 'Bananas' },
    { id: 4, name: 'Mangos' },
    { id: 5, name: 'Lemons' },
    { id: 6, name: 'Apricots' },
  ]);
  console.log(informed, 'informed object');
  console.log(fieldState, 'fieldState');
  return render(
    <>
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        noSuggestionsText={'No suggestions found'}
        handleDelete={i => {
          const newTags = tags.slice(0);
          newTags.splice(i, 1);
          setTags(newTags);
          console.log(newTags, 'in HandleDelete');
        }}
        handleAddition={tag => {
          // Needs to be wired into informed. Understand react forms tutorial use UseState react.
          // Do we need local state or not
          // @ts-ignore
          setTags([...tags, tag]);
        }}
        inputAttributes={informed}
      />
      <pre style={{ color: 'red', backgroundColor: 'black' }}>
        <code>{JSON.stringify({ tags }, null, 2)}</code>
      </pre>

      {fieldState.error ? (
        <small style={{ color: 'red' }}>{fieldState.error}</small>
      ) : null}
    </>,
  );
};
const MyFormTest = () => (
  <Form>
    <label>
      React Tag Autocomplete POC:
      <InformedReactTag
        field="tags"
        validate={validate}
        validateOnChange
        validateOnBlur
      />
    </label>
    <button type="submit">Submit</button>
  </Form>
);


export { MyFormTest, InformedReactTag, NonInformedReactTag };
