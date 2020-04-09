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
import { Tag as TagType } from 'react-tag-autocomplete';
import { isEmpty } from 'lodash';
import {
  getUI, useEditContext, withEditButton,
} from '@bodiless/core';
import { useFilterByGroupContext } from './FilterByGroupContext';
import Tag from './FilterByGroupTag';
import { useItemsAccessors } from './FilterTagsModel';

const withNewTagButton = withEditButton({
  icon: 'local_offer',
  name: 'Tags',
  renderForm: ({ ui, formApi }) => {
    const pageContext = useEditContext();
    const {
      ComponentFormTitle,
      ComponentFormLabel,
      ComponentFormText,
      ComponentFormUnwrapButton,
      ReactTags,
    } = getUI(ui);

    const { tag } = useItemsAccessors();
    const context = useFilterByGroupContext();
    const { allTags } = context;
    const [tags, updateTags] = useState<TagType[]>();

    const handleAddition = (newTag: TagType) => {
      let tagToAdd = newTag;

      if (isEmpty(tagToAdd.id)) {
        tagToAdd = new Tag(tagToAdd.name);
      }

      updateTags([tagToAdd]);
      formApi.setValue('id', tagToAdd.id);
      formApi.setValue('name', tagToAdd.name);
    };

    const handleDelete = (hasTag: any) => {
      formApi.setValue('id', tag.id);
      formApi.setValue('name', tag.name);
      updateTags([]);
    }

    const displayListOfTags = () => pageContext.showPageOverlay({
      message: allTags.slice().reverse().reduce((acc, tag) => `${acc}\n${tag.name}`, ''),
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
          suggestions={allTags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          placeholder="Select Tags"
          noSuggestionsText="No maching tags found."
          autoresize={false}
          minQueryLength={1}
          allowNew
        />
        <ComponentFormUnwrapButton type="button" onClick={displayListOfTags}>See All Tags</ComponentFormUnwrapButton>
      </>
    );
  },
  global: false,
  local: true,
});

export default withNewTagButton;
export {
  withNewTagButton,
};
