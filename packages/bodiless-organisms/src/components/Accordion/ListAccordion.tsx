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

import React, { HTMLProps } from 'react';
import { flow } from 'lodash';
import { withNode, withNodeKey } from '@bodiless/core';
import { withDesign, replaceWith } from '@bodiless/fclasses';
import {
  Editable,
  List,
  ListTitleProps,
  asEditableList,
  asEditable,
} from '@bodiless/components';

import { SingleAccordionClean } from './SingleAccordion';

const SimpleTitle = (props: HTMLProps<HTMLSpanElement> & ListTitleProps) => (
  <span {...props}><Editable nodeKey="text" placeholder="Accordion Body Text" /></span>
);

const SimpleList = withDesign({
  Title: replaceWith(SimpleTitle),
})(asEditableList(List));

const SimpleAccordion = flow(
  withDesign({
    Title: asEditable('category_name', 'Category Name'),
    Body: replaceWith(SimpleList),
  }),
)(SingleAccordionClean);

const ListAccordionClean = flow(
  withNodeKey('accordion-list'),
  withDesign({
    Title: replaceWith(SimpleAccordion),
  }),
)((asEditableList(List)));

const asListAccordion = flow(
  withNode,
  withDesign({
    Title: asEditable('category_name', 'Category Name'),
    Body: replaceWith(SimpleList),
  }),
);

const ListAccordion = asListAccordion(SingleAccordionClean);

export default ListAccordion;
export {
  ListAccordion,
  ListAccordionClean,
  SimpleAccordion,
  asListAccordion,
};
