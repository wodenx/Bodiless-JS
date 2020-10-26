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

import { ComponentType } from 'react';
import { flow } from 'lodash';
import {
  addClasses, withDesign, replaceWith, Div,
} from '@bodiless/fclasses';
import {
  asMenuLink, asSimpleMenuBase, withSimpleMenuDesign, asSimpleMenuTopNav,
} from '@bodiless/organisms';

import { withEditorSimple } from '../Editors';
import withSimpleMenuStyles from './SimpleMenu.token';

const withTitleEditor = withEditorSimple('text', 'Menu Item');
const asMenuTitle = flow(
  asMenuLink(withTitleEditor),
  withDesign({
    _default: replaceWith(Div),
  }),
);

const SimpleMenuBase = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuTitle,
  }),
)('ul') as ComponentType<any>;

const SimpleMenu = flow(
  withSimpleMenuStyles,
  asSimpleMenuTopNav,
)(SimpleMenuBase);

const SimpleMenuList = flow(
  withSimpleMenuDesign({
    Item: addClasses('pl-5'),
  }),
)(SimpleMenuBase);

export default SimpleMenu;
export {
  SimpleMenuBase,
  SimpleMenuList,
  asMenuTitle,
};
