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
import ReactTags, { Tag } from 'react-tag-autocomplete';
import {
  TMenuOption, withMenuOptions,
  contextMenuForm, getUI, useEditContext,
} from '@bodiless/core';
import { useFilterByGroupContext } from './FilterByGroupContext';
import './react-tags.css';

type TMenuOptionGetter = () => TMenuOption[];

const tagSelectForm = () => contextMenuForm({
  submitValues: (values: any) => {
    console.log('Submitted: ', values.tag);
  },
})(
  ({ ui, formApi }: any) => {
    const editContext = useEditContext();
    const {
      ComponentFormTitle,
      ComponentFormLabel,
      ComponentFormText,
    } = getUI(ui);

    const { allTags } = useFilterByGroupContext();
    const [tags, updateTags] = useState<Tag[]>();

    const handleAddition = (tag: Tag) => {
      updateTags([tag]);
      formApi.setValue('tag', tag);
    };

    console.log('editContext ', editContext);

    return (
      <>
        <ComponentFormTitle>Tags: </ComponentFormTitle>
        <ComponentFormLabel>Select from available tags:</ComponentFormLabel>
        <ComponentFormText field="tag" type="hidden" />
        <ReactTags
          tags={tags}
          suggestions={allTags}
          handleDelete={() => updateTags([])}
          handleAddition={handleAddition}
          placeholder="Select Tags"
          noSuggestionsText="No maching tags found."
          autoresize={false}
          minQueryLength={1}
        />
      </>
    );
  },
);

// ==============================
// TODO: This should be a general useMenuHandler() utility exposed by bodiless core.
// ==============================
const withNewTagButton = () => {
  const useGetMenuOptions = (): TMenuOptionGetter => () => (
    [{
      icon: 'local_offer',
      name: 'Tag',
      handler: () => tagSelectForm(),
      global: false,
      local: true,
    }]
  );

  return withMenuOptions({ useGetMenuOptions, name: 'tag' });
};

export default withNewTagButton;
export {
  withNewTagButton,
};
