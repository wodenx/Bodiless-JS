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

import React from 'react';
import { withDesign, addClasses, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import {
  asEditable as withEditorSimple,
  asBodilessList,
  asSubList,
} from '@bodiless/components';
import { asStylableList, asMenuLink } from '@bodiless/organisms';
import asChameleonTitle from './asChameleonTitle';

const Foo = (props: any) => <div id="foo" {...props} />;
export const MenuLinkChameleon = flow(
  asChameleonTitle,
  stylable,
  withDesign({
    Link: addClasses('italic'),
  }),
)(Foo);

const withTitleEditor = withEditorSimple('text', 'Menu Item');

const asMenuLinkList = flow(
  withDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asStylableList,
);
const asIndentedSubList = flow(
  asSubList,
  asMenuLinkList,
  withDesign({
    Item: addClasses('pl-5'),
  }),
);
export const CompoundList = flow(
  asBodilessList('clist'),
  asMenuLinkList,
  withDesign({
    Item: asIndentedSubList,
  }),
)('ul');
