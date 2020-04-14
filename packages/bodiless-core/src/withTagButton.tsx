/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { flowRight } from 'lodash';
import { Tag as TagType } from 'react-tag-autocomplete';
import { withPageContext, withoutProps } from './hoc';
import { PageEditContextInterface } from './PageEditContext/types';
import { TMenuOptionGetter } from './Types/PageContextProviderTypes';
import { EditButtonProps } from './withEditButton';
import contextMenuForm, { getUI } from './contextMenuForm';

export type TagButtonOptions = {
  suggestions: TagType[],
  placeholder?: string,
  noSuggestionsText?: string,
  minQueryLength?: number,
  allowNew?: boolean,
  allowMultipleTags?: boolean,
};

const renderTagsForm = (
  options: TagButtonOptions,
  context: PageEditContextInterface,
) => contextMenuForm({
  submitValues: () => console.log('Form Submitted...'),
})(
  ({ ui /* formApi */ }: any) => {
    const {
      ComponentFormTitle,
      ComponentFormLabel,
      ComponentFormText,
      ComponentFormUnwrapButton,
      ReactTags,
    } = getUI(ui);

    const {
      suggestions,
      placeholder = 'Select Tags',
      noSuggestionsText = 'No maching tags found.',
      minQueryLength = 1,
      allowNew = true,
      allowMultipleTags = true,
    } = options;

    const [tags, updateTags] = useState<TagType[]>([]);

    const handleAddition = (newTag: TagType) => {
      updateTags(allowMultipleTags ? [...tags, newTag] : [newTag]);
    };

    const handleDelete = (i: number) => {
      const newTags = tags.slice(0);
      newTags.splice(i, 1);
      updateTags(newTags);
    };

    const displayListOfTags = () => context.showPageOverlay({
      message: suggestions.slice().reduce((acc, _tag) => `${acc}\n${_tag.name}`, ''),
      hasSpinner: false,
      hasCloseButton: true,
    });

    return (
      <>
        <ComponentFormTitle>Tags: </ComponentFormTitle>
        <ComponentFormLabel>Select from available tags:</ComponentFormLabel>
        <ComponentFormText field="id" type="hidden" />
        <ComponentFormText field="name" type="hidden" />
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          placeholder={placeholder}
          noSuggestionsText={noSuggestionsText}
          minQueryLength={minQueryLength}
          allowNew={allowNew}
        />
        <ComponentFormUnwrapButton type="button" onClick={displayListOfTags}>See All Tags</ComponentFormUnwrapButton>
      </>
    );
  },
);

const createMenuOptionHook = <P extends object, D extends object>(options: TagButtonOptions) => (
  props: P & EditButtonProps<D>,
  context: PageEditContextInterface,
) => {
  const getMenuOptions: TMenuOptionGetter = () => [
    {
      icon: 'local_offer',
      name: 'tags',
      global: false,
      local: true,
      handler: () => renderTagsForm(options, context),
    },
  ];

  return getMenuOptions;
};

const withTagButton = (
  options: TagButtonOptions,
) => flowRight(
  withPageContext({
    useGetMenuOptions: createMenuOptionHook(options),
    name: 'tags',
  }),
  withoutProps(['setComponentData', 'unwrap', 'isActive']),
);

export default withTagButton;
