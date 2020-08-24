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

import { Fragment } from 'react';
import { flow } from 'lodash';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  asMenuLink,
} from '@bodiless/organisms';

import {
  withDesign, addClasses, addProps,
} from '@bodiless/fclasses';
import { withTitle } from '@bodiless/layouts';
import { withEditorSimple } from '../../../components/Editors';
import { asExceptMobile } from '../../../components/Elements.token';

import { withMenuListStyles, withMenuSublistStyles } from '../../../components/Menus/token';
import asBodilessChamelion from './Chamelion';
import asMenuTout from './MenuTout';
import asMenu, { asSubMenu, asMenuItemGroup } from './asMenu';

const withMegaMenuStyles = withDesign({
  Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
  Item: addClasses('w-1/3'),
});

const asColumn = flow(
  asMenuItemGroup,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
  withMenuSublistStyles,
);

const asBasicSubMenu = flow(
  asSubMenu,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const asToutSubMenu = flow(
  asBasicSubMenu,
  withDesign({
    Title: asMenuTout,
  }),
  withMegaMenuStyles,
);

const asColumnSubMenu = flow(
  asBasicSubMenu,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asColumn,
  }),
  withMegaMenuStyles,
);

const asChamelionSubMenu = flow(
  asBodilessChamelion('cham-sublist', { component: 'None' }, {
    icon: 'playlist_add',
    label: 'Sub',
  }),
  withDesign({
    None: withTitle('No sub-menu'),
    Basic: flow(asBasicSubMenu, withTitle('Basic sub-menu')),
    Touts: flow(asToutSubMenu, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubMenu, withTitle('Column sub-menu')),
  }),
);

const Menu = flow(
  asMenu(),
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asChamelionSubMenu,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
)(Fragment);

export default Menu;
