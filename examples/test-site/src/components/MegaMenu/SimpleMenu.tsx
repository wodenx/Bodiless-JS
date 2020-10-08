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
import { addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import {
  asMenuLink, asSimpleMenuBase, withSimpleMenuDesign,
  asSimpleMenu,
} from '@bodiless/organisms';
import { withSimpleMenuStyles } from './MegaMenu.token';
import { withTitleEditor } from './MegaMenu';

export const SimpleMenu = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asSimpleMenu,
  withSimpleMenuStyles,
)('ul');

export const SimpleMenuList = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withSimpleMenuDesign({
    Item: addClasses('pl-5'),
  }),
)('ul') as ComponentType<any>;
