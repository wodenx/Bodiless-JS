import React, { useState } from 'react';
import { Form, useFormApi, Text } from 'informed';
import ReactTags, { Tag } from 'react-tag-autocomplete';
import { useNode } from '@bodiless/core';
import { Data } from './Item';
// import { TagsSingleAccordion } from './AllTags';

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
      <Text type="hidden" field="tags" data-tags="data-tags" />
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
const AllSuggestions = ({ suggestions }: { suggestions: Tag[] }) => (
  <ul>
    {suggestions.map(s => (
      <li>{s.name}</li>
    ))}
  </ul>
);

const ReactTagField = (options: Options) => {
  const { onChange, suggestions } = options;
  // @todo review how do I get existing tags?
  const { getTags } = useAccessors();
  console.log('our tags', getTags());
  // @todo review: Get the tags from storage and use those tags as default values
  const [tags, setTags] = useState(getTags());
  // @todo @chris style using bodiless pattern?
  const styles = {
    className: 'h-8 bl-text-grey-900 bg-grey-100 bl-w-full',
  };

  const classes = {
    root: 'react-tags',
    rootFocused: 'is-focused',
    selected: 'react-tags__selected',
    selectedTag: 'react-tags__selected-tag hover:bg-gray-100',
    selectedTagName:
      'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400',
    search: 'react-tags__search',
    searchInput: 'shadow w-full text-gray-700 py-1 leading-tight',
    suggestions:
      'bg-white hover:bg-gray-400 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow',
    suggestionActive: 'is-active',
    suggestionDisabled: 'is-disabled',
  };

  // @Todo: does not allow to add new tag?
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
