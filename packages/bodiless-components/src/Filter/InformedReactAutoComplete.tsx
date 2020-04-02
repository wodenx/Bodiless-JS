import React, { useState } from 'react';
import { Form, useFormApi, Text } from 'informed';
import ReactTags, { Tag } from 'react-tag-autocomplete';

// Type of options passed to InformedReactTagField
export type Options = {
  onChange?: any; // @todo fix type: (tags: Tag) => {};
  suggestions: Tag[];
};

// @Todo Determine if and how to do validation.
const validate = (value: any) => {
  console.log('validation value:', value);
  return value.name.length >= 5;
};


const ReactTagSampleForm = (props: Options) => (
  <Form onSubmit={(values: any) => console.log(values)}>
    <InformedReactTagField {...props} />
    <button type="submit">Submit</button>
  </Form>
);

/*
 * Componenet that uses a hidden informed field and react-tag.
 *
 * @todo: Determine the type of props and how we pass them.
 */
const InformedReactTagField = (props: Options) => {
  const api = useFormApi();
  return (
    <>
      <Text type="hidden" field="tags" />
      <ReactTagField
        onChange={(tags: Tag[]) => {
          console.log('change', tags);
          api.setValue('tags', tags);
        }}
        {...props}
      />
    </>
  );
};

const ReactTagField = (options: Options) => {
  const { onChange, suggestions } = options;
  // @todo How do I get existing tags?

  // const tags = // Get the tags for compoenet from storage?
  // and use those tags as default values
  // update theses tags
  const [tags, setTags] = useState([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);

  // @ts-ignore
  // @todo @chris style using bodiless pattern?
  const ClassNames = {
    root: 'react-tags',
    rootFocused: 'is-focused',
    selected: 'react-tags__selected',
    selectedTag: 'react-tags__selected-tag',
    selectedTagName: 'react-tags__selected-tag-name',
    search: 'react-tags__search',
    searchInput: 'bl-text-grey-900 bg-grey-100',
    suggestions: 'react-tags__suggestions',
    suggestionActive: 'is-active',
    suggestionDisabled: 'is-disabled',
  };

  return (
    <>
      <ReactTags
        classNames={ClassNames}
        tags={tags}
        suggestions={suggestions}
        noSuggestionsText={'No suggestions found'}
        handleDelete={i => {
          const newTags = tags.slice(0);
          newTags.splice(i, 1);
          setTags(newTags);
          onChange(newTags);
        }}
        handleAddition={(tag: any) => {
          const newTags = [...tags, tag];
          setTags(newTags);
          onChange(newTags);
        }}
        handleValidate={(tag: any) => validate(tag)}
      />
      <pre style={{ color: 'red', backgroundColor: 'black' }}>
        <code>{JSON.stringify({ tags }, null, 2)}</code>
      </pre>
    </>
  );
};

export { ReactTagSampleForm, InformedReactTagField };
