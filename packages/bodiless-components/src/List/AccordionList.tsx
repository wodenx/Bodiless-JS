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
import { withNode } from '@bodiless/core';
import { withDesign, replaceWith } from '@bodiless/fclasses';

import { SingleAccordionClean } from '../AccordionTemp';
import Editable, { asEditable } from '../Editable';

import List from '.';
import asEditableList from './asEditableList';
import { TitleProps } from './types';


const SimpleTitle = (props: HTMLProps<HTMLSpanElement> & TitleProps) => (
  <span {...props}><Editable nodeKey="text" placeholder="Item" /></span>
);

const SimpleList = withDesign({
  Title: replaceWith(SimpleTitle),
})(asEditableList(List));

const asAccordionList = flow(
  withNode,
  withDesign({
    Title: asEditable('category_name', 'Category Name'),
    Body: replaceWith(SimpleList),
  }),
);

const AccordionList = asAccordionList(SingleAccordionClean);

export default AccordionList;
