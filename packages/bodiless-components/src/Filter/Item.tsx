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

import React, {HTMLProps} from 'react';
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
import { InformedReactTagField } from './InformedReactAutoComplete';
import {Tag} from "react-tag-autocomplete";

// Type of the data used by this component.
export type Data = {
  tags: Tag[];
};

// @todo: Using this is enough?
type Props = HTMLProps<HTMLElement>;
// @todo: OR do I need logic below copied from link? what is it doing?
// Type of the props accepted by this component.
// Exclude the tag from the props accepted as we write it.
// type AProps = HTMLProps<HTMLAnchorElement>;
//
// export type Props = Pick<AProps, Exclude<keyof AProps, 'tag'>> & {
//   unwrap?: () => void;
// };


const editButtonOptions = (
  suggestions: Tag[],
): EditButtonOptions<Props, Data> => {
  return {
    icon: 'add',
    name: 'Add',
    renderForm: ({ ui: formUi, closeForm }) => {
      const { ComponentFormTitle } = getUI(formUi);
      return (
        <>
          <ComponentFormTitle>Group Membership</ComponentFormTitle>
          <InformedReactTagField suggestions={suggestions}  />
        </>
      );
    },
    global: false,
    local: true,
  };
};


const emptyValue = {
  tags: '',
};

// Allow us to pass suggestions to react tag field.
// const withAutoCompleteSuggestions = (tags: Tag[]) => (TaggableComp: CT) => (
//   props: any,
// ) => {
//   return (
//     <TaggableComp suggestions={tags} {...props}/>
//   );
// };

// Composed hoc which creates editable version of the component.
// Note - the order is important. In particular:
// - the node data handlers must be outermost
// - anything relying on the context (activator, indicator) must be
//   *after* `withEditButton()` as this establishes the context.
// - withData must be *after* the data handlers are defiend.
export const asBodilessFilterItem = (nodeKey?: string, suggestions?: any) => {
 console.log('in asBodilessFilterItem', nodeKey);
  console.log('in asBodilessFilterItem', suggestions);

  return flowRight(
    withNodeKey(nodeKey),
    withNode,
    withNodeDataHandlers(emptyValue),
    ifReadOnly(withoutProps(['setComponentData'])),
    ifEditable(
      withEditButton(editButtonOptions(suggestions)),
      withContextActivator('onClick'),
      withLocalContextMenu,
    ),
    withData,
  ) as Bodiless<Props, Props & Partial<WithNodeProps>>
};
const FilterItem = asBodilessFilterItem()('span');
export default FilterItem;
