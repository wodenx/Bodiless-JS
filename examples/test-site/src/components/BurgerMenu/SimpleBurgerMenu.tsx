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
import { withDesign, replaceWith } from '@bodiless/fclasses';
import { asStatic } from '@bodiless/core';
import { asSimpleBurgerMenu } from '@bodiless/organisms';

import { SimpleMenuBase } from '../MegaMenu/SimpleMenu';
import BurgerMenu from './BurgerMenu';
import withSimpleBurgerMenuStyles, { withBurgerMenuDebugStyles } from './SimpleBurgerMenu.token';

const BurgerMenuBody = flow(
  asSimpleBurgerMenu,
  withSimpleBurgerMenuStyles,
  withBurgerMenuDebugStyles,
  asStatic,
)(SimpleMenuBase);

const SimpleBurgerMenu = flow(
  withDesign({
    Body: replaceWith(BurgerMenuBody),
  }),
)(BurgerMenu);

export default SimpleBurgerMenu;
