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

import React, { HTMLProps, useState } from 'react';
import {
  EditButtonOptions,
  getUI,
  withEditButton,
  withContextActivator,
  withNode,
  withNodeDataHandlers,
  withLocalContextMenu,
  WithNodeProps,
  ifEditable,
  Bodiless,
  ifReadOnly,
  withNodeKey,
  withoutProps,
  useNode,
  useEditContext,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { Tag } from 'react-tag-autocomplete';

// Type of the data used by this component.
export type Data = {
  tags: Tag[];
};

// @Todo: Determine if this type is necessary?
type Props = HTMLProps<HTMLElement>;

/*
 * Hook to access tags.
 */
const useAccessors = () => {
  const { node } = useNode<Data>();
  return {
    getTags: () => node.data.tags,
  };
};

export const editButtonOptions: EditButtonOptions<Props, Data> = {
  icon: 'local_offer',
  name: 'Add',
  renderForm: ({ ui: formUi, props: props, formApi }) => {
    const { getTags } = useAccessors();
    const [tags, setTags] = useState(getTags());
    const { suggestions } = props;
    // Update the value for Infomed tags field on change.
    const onChange = (tags: Tag[]) => formApi.setValue('tags', tags);

    // Show the available suggestions up
    const pageContext = useEditContext();
    const displayListOfSuggestions = () => {
      return pageContext.showPageOverlay({
        message: suggestions.map((s: Tag) => `${s.name}\n`),
        hasSpinner: false,
        hasCloseButton: true,
      });
    };

    const {
      ComponentFormTitle,
      ComponentFormText,
      ComponentFormUnwrapButton,
      ReactTags,
    } = getUI(formUi);
    return (
      <>
        <ComponentFormTitle>Group Membership</ComponentFormTitle>
        <ComponentFormText type="hidden" field="tags" />
        <ReactTags
          suggestions={suggestions}
          autoresize={false}
          tags={tags}
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
        />
        <ComponentFormUnwrapButton
          type="button"
          onClick={displayListOfSuggestions}
        >
          See All Groups
        </ComponentFormUnwrapButton>
      </>
    );
  },
  global: false,
  local: true,
};

const emptyValue = {
  tags: '',
};

// Composed hoc which creates editable version of the component.
// Note - the order is important. In particular:
// - the node data handlers must be outermost
// - anything relying on the context (activator, indicator) must be
//   *after* `withEditButton()` as this establishes the context.
// - withData must be *after* the data handlers are defiend.
// @todo: revist review the markup produced by adding a tag: Determine what we need to do with withData?
// @todo revisit suggestions as they need to be passed at runtime?
export const asBodilessFilterItem = (nodeKey?: string, suggestions?: any) => {
  console.log('in asBodilessFilterItem', nodeKey);
  console.log('in asBodilessFilterItem', suggestions);
  return flowRight(
    withNodeKey(nodeKey),
    withNode,
    withNodeDataHandlers(emptyValue),
    ifReadOnly(withoutProps(['setComponentData'])),
    ifEditable(
      withEditButton(editButtonOptions),
      withContextActivator('onClick'),
      withLocalContextMenu,
    ),
    withoutProps(['suggestions', 'componentData']),
  ) as Bodiless<Props, Props & Partial<WithNodeProps>>;
};
const FilterItem = asBodilessFilterItem()('span');
export default FilterItem;
