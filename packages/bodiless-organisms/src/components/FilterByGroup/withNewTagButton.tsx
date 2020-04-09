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
import { Tag } from 'react-tag-autocomplete';
import {
  TMenuOption, withMenuOptions,
  contextMenuForm, getUI, useEditContext,
} from '@bodiless/core';
import { useFilterByGroupContext } from './FilterByGroupContext';
import { FBGContextInterface } from './types';

type TMenuOptionGetter = () => TMenuOption[];

type FormProps = {
  context: FBGContextInterface,
  onAdd: () => void,
};

type TagButtonProps = {
  setTag?: (tag: Tag) => void,
};

const tagSelectForm = ({ context, onAdd, setTag }: FormProps & TagButtonProps) => contextMenuForm({
  submitValues: (values: any) => {
    console.log('Submitted: ', values.tag);
    console.log('onAdd: ', onAdd);
    // onAdd();
    if (setTag && typeof setTag === 'function') {
      setTag(values.tag);
    }
  },
})(
  ({ ui, formApi }: any) => {
    const pageContext = useEditContext();
    const {
      ComponentFormTitle,
      ComponentFormLabel,
      ComponentFormText,
      ComponentFormUnwrapButton,
      ReactTags,
    } = getUI(ui);

    const { allTags } = context;
    const [tags, updateTags] = useState<Tag[]>();

    const handleAddition = (tag: Tag) => {
      updateTags([tag]);
      formApi.setValue('tag', tag);
    };

    const displayListOfTags = () => pageContext.showPageOverlay({
      message: allTags.slice().reverse().reduce((acc, tag) => `${acc}\n${tag.name}`, ''),
      hasSpinner: false,
      hasCloseButton: true,
    });

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
        <ComponentFormUnwrapButton type="button" onClick={displayListOfTags}>See All Tags</ComponentFormUnwrapButton>
      </>
    );
  },
);

// ==============================
// TODO: This should be a general useMenuHandler() utility exposed by bodiless core.
// ==============================
const withNewTagButton = ({ setTag }: TagButtonProps) => {
  const context = useFilterByGroupContext();

  const useGetMenuOptions = (props: any): TMenuOptionGetter => () => {
    const { onAdd } = props;

    return (
      [{
        icon: 'local_offer',
        name: 'Tag',
        handler: () => tagSelectForm({ context, onAdd, setTag }),
        global: false,
        local: true,
      }]
    );
  };

  return withMenuOptions({ useGetMenuOptions, name: 'tag' });
};

export default withNewTagButton;
export {
  withNewTagButton,
};
