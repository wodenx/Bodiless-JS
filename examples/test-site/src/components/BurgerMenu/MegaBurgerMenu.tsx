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
import { asStatic } from '@bodiless/core';
import { asEditable } from '@bodiless/components';
import {
  withDesign, replaceWith, addClasses, H2,
} from '@bodiless/fclasses';
import {
  asMenuTout, asMegaMenuBase, withMegaMenuDesign, asMegaBurgerMenu,
} from '@bodiless/organisms';

import { withToutEditors } from '../Tout';
import BurgerMenu from './BurgerMenu';
import { BurgerMenuTitle } from './SimpleBurgerMenu';

import withMegaBurgerMenuStyles, { withMegaBurgerDebugStyles, withMenuToutStyles } from './MegaBurgerMenu.token';

const withMenuToutEditors = flow(
  withToutEditors,
  withDesign({
    Title: flow(
      replaceWith(H2),
      // We set the title editor to match the one in asMenuLink
      asEditable('text', 'Title'),
    ),
  }),
);

const asMenuTout$ = flow(
  asMenuTout(withMenuToutEditors),
  withMenuToutStyles,
);

const BurgerMenuBody = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: BurgerMenuTitle,
  }),
  withDesign({
    Item: withDesign({
      Touts: withDesign({
        Title: asMenuTout$,
      }),
    }),
  }),
  asMegaBurgerMenu,
  withMegaBurgerMenuStyles,
  withMegaBurgerDebugStyles,
  asStatic,
)('ul');

const MegaBurgerMenu = flow(
  withDesign({
    Body: replaceWith(BurgerMenuBody),
  }),
)(BurgerMenu);

const MegaBurgerMenuList = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: BurgerMenuTitle,
    Item: addClasses('pl-5'),
  }),
  withMegaBurgerDebugStyles,
)('ul');

export default MegaBurgerMenu;
export {
  MegaBurgerMenuList,
};
