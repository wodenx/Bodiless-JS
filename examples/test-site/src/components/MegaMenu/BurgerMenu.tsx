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

import { flow } from 'lodash';
import { withDesign, replaceWith, addClasses } from '@bodiless/fclasses';
import { asStatic } from '@bodiless/core';
import {
  asMenuLink, asSimpleMenuBase, withSimpleMenuDesign,
  withAccordionSubmenu, SimpleBurgerMenuClean,
} from '@bodiless/organisms';
import { asEditable } from '@bodiless/components';

// import { withTitleEditor } from './MegaMenu';
import Logo from '../Layout/logo';
import withBurgerMenuStyles, { asBurgerMenu } from './BurgerMenu.token';

const withTitleEditor = asEditable('text', 'Menu Item');

const BurgerMenuBody = flow(
  asSimpleMenuBase(),
  withAccordionSubmenu,
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withBurgerMenuStyles,
  asStatic,
)('ul');

const BurgerMenu = flow(
  withDesign({
    Header: replaceWith(Logo),
    Body: replaceWith(BurgerMenuBody),
  }),
  asBurgerMenu,
)(SimpleBurgerMenuClean);

const BurgerMenuList = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
    Item: addClasses('pl-5'),
  }),
)('ul');

export default BurgerMenu;
export {
  BurgerMenuList,
};
