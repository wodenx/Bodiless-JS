import React, { useState } from 'react';
import { Form, useFormApi, Text } from 'informed';
import ReactTags, { Tag } from 'react-tag-autocomplete';
import { useNode } from '@bodiless/core';
import { Data } from './Item';

// Type of options passed to InformedReactTagField
export type Props = {
  onChange?: any; // @todo fix type: (tags: Tag) => {};
  suggestions: Tag[];
  // ui?: any; @Todo: use UI system.
};

// @Todo do we need validation and determine if and how to do validation (partially working)
const validate = (value: any) => {
  console.log('validation value:', value);
  return value.name.length >= 5;
};

/*
 * Component used to provide a sample form with ReactTags.
 */
const ReactTagSampleForm = (props: Props) => (
  <Form onSubmit={(values: any) => console.log(values)}>
    <InformedReactTagField {...props} />
    <button type="submit">Submit</button>
  </Form>
);

/*
 * Componenet that uses a hidden informed field and react-tag.
 */
const InformedReactTagField = (props: Props) => {
  const api = useFormApi();
  return (
    <>
      <Text type="hidden" field="tags" />
      <ReactTagField
        onChange={(tags: Tag[]) => api.setValue('tags', tags)}
        {...props}
      />
    </>
  );
};

/*
 * Hook to access tags.
 */
const useAccessors = () => {
  const { node } = useNode<Data>();
  return {
    getTags: () => node.data.tags,
  };
};

/*
 * Component to display all suggestions
 *
 * @Todo: Display a popup instead of list.
 */
const AllSuggestions = ({ suggestions }: { suggestions: Tag[] }) => (
  <ul>
    {suggestions.map(s => (
      <li key={s.id}>{s.name}</li>
    ))}
  </ul>
);

const ReactTagField = (props: Props) => {
  const { onChange, suggestions } = props;
  const { getTags } = useAccessors();
  const [tags, setTags] = useState(getTags());

  // @Todo input element styles can only be changed using the 'inputAttributes' prop on ReactTags.
  const styles = {
    className: 'h-8 bl-text-grey-900 bg-grey-100 bl-w-full',
  };
  // @Todo how can we style the component when React-Tags only provide 'classNames' property:
  const classes = {
    root: '',
    rootFocused: '',
    selected: '',
    selectedTag: 'hover:bg-gray-100',
    selectedTagName:
      'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400',
    search: '',
    searchInput: 'shadow w-full text-gray-700 py-1 leading-tight',
    suggestions:
      'bg-white hover:bg-gray-400 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow',
    suggestionActive: '',
    suggestionDisabled: '',
  };

  return (
    <>
      <ReactTags
        autoresize={false}
        classNames={classes}
        tags={tags}
        suggestions={suggestions}
        placeholder={'Add or creat'}
        noSuggestionsText={'No suggestions found'}
        allowNew={true}
        addOnBlur={true}
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
        inputAttributes={styles}
      />
      <AllSuggestions suggestions={suggestions} />
    </>
  );
};

export { ReactTagSampleForm, InformedReactTagField };
