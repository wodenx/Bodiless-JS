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

import { addClasses } from '@bodiless/fclasses';
import {
  asMenuLink, asSimpleMenuBase, withSimpleMenuDesign, asSimpleMenuTopNav,
} from '@bodiless/organisms';

import { withTitleEditor } from './MegaMenu';
import withSimpleMenuStyles from './SimpleMenu.token';

const SimpleMenu = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withSimpleMenuStyles,
  asSimpleMenuTopNav,
)('ul') as ComponentType<any>;

const SimpleMenuList = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
    Item: addClasses('pl-5'),
  }),
)('ul') as ComponentType<any>;

export default SimpleMenu;
export {
  SimpleMenuList,
};
