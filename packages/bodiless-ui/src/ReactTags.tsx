import React from 'react';
import ReactTagsBase, { ReactTagsProps } from 'react-tag-autocomplete';

import './ReactTags.css';

const ReactTags = (props: ReactTagsProps) => {
  const classes = {
    root: 'bl-react-tags',
    rootFocused: 'is-focused',
    selected: 'bl-react-tags__selected',
    selectedTag: 'bl-react-tags__selected-tag',
    selectedTagName: 'bl-react-tags__selected-tag-name',
    search: 'bl-react-tags__search',
    searchInput: 'bl-react-tags__search-input',
    suggestions: 'bl-react-tags__suggestions',
    suggestionActive: 'is-active',
    suggestionDisabled: 'is-disabled',
  };

  return (
    <ReactTagsBase
      classNames={classes}
      {...props}
    />
  );
};

export default ReactTags;
export {
  ReactTags,
};
