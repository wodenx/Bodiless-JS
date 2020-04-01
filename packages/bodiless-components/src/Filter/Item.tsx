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

 //todo: rename to taggable

import React, {HTMLProps, useState} from 'react';
// @todo where this should liberary live? leave in bodiless-comp for now.
import ReactTags from 'react-tag-autocomplete';
import {
  EditButtonOptions,
  getUI,
  withEditButton,
  withData,
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
} from '@bodiless/core';
import { flowRight } from 'lodash';

// Type of the data used by this component.
export type Data = {
  tag: string;
};

// Type of the props accepted by this component.
// Exclude the tag from the props accepted as we write it.
type AProps = HTMLProps<HTMLAnchorElement>;

export type Props = Pick<AProps, Exclude<keyof AProps, 'tag'>> & {
  unwrap?: () => void;
};


// Options used to create an edit button.
export const editButtonOptions: EditButtonOptions<Props, Data> = {
  icon: 'add',
  name: 'Add',
  renderForm: ({ ui: formUi, closeForm }) => {
    const {
      ComponentFormTitle,
      ComponentFormText,
      ComponentFormUnwrapButton,
    } = getUI(formUi);
    const viewTagsHandler = (event: React.MouseEvent) => {
      event.preventDefault();
      closeForm();
    };
    const [tags, setTags] = useState([
      // { id: 1, name: 'Apples' },
      // { id: 2, name: 'Pears' },
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
        <ComponentFormTitle>Group</ComponentFormTitle>
        <ComponentFormText field="tag" id="tag" />
         {/*// @TODO move this to ui and make it like ComponenetFormText? How? Lets leave it here for now. */}
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          noSuggestionsText={'No suggestions found'}
          handleDelete={i => {
            setTags(tags.splice(i, 1));
            console.log(tags);
          }}
          handleAddition={tag  => {
            let temp = [ ...tags, tag];
            console.log(temp);
            // Needs to be wired into informed. Understand react forms tutorial use UseState react.
            // Do we need local state or not?
             // @ts-ignore
            setTags(temp);
          }}
        />
        <ComponentFormUnwrapButton type="button" onClick={viewTagsHandler}>
          View All Groups [Todo]
        </ComponentFormUnwrapButton>
      </>
    );
  },
  global: false,
  local: true,
};

const emptyValue = {
  tag: '',
};
// Composed hoc which creates editable version of the component.
// Note - the order is important. In particular:
// - the node data handlers must be outermost
// - anything relying on the context (activator, indicator) must be
//   *after* `withEditButton()` as this establishes the context.
// - withData must be *after* the data handlers are defiend.
export const asBodilessFilterItem = (nodeKey?: string) =>
  flowRight(
    // @ts-ignore: Types of parameters are incompatible.
    withNodeKey(nodeKey),
    withNode,
    withNodeDataHandlers(emptyValue),
    ifReadOnly(withoutProps(['setComponentData'])),
    ifEditable(
      withEditButton(editButtonOptions),
      withContextActivator('onClick'),
      withLocalContextMenu,
    ),
    withData,
  ) as Bodiless<Props, Props & Partial<WithNodeProps>>;
const FilterItem = asBodilessFilterItem()('span');
export default FilterItem;
