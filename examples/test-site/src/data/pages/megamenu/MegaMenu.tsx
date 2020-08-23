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
import { flow, identity } from 'lodash';
import {
  List,
} from '@bodiless/components';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  withSubmenu,
  asMenuLink,
} from '@bodiless/organisms';

import {
  withDesign, addClasses, addProps,
} from '@bodiless/fclasses';
import { replaceWith } from '@bodiless/fclasses/src/Design';
import { withTitle } from '@bodiless/layouts';
import { withEditorSimple } from '../../../components/Editors';
import { asExceptMobile } from '../../../components/Elements.token';

import { withMenuListStyles, withMenuSublistStyles } from '../../../components/Menus/token';
import asChamelionTitle from './asChamelionTitle';
import asBodilessChamelion from './Chamelion';
import asMenuTout from './MenuTout';
import asMenu, { asTitledItem, asSubMenu, asMenuItemGroup } from './asMenu';

const asGroup = flow(
  asMenuItemGroup,
  asTitledItem,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: addClasses('block'),
  }),
  withMenuSublistStyles,
);

// Basic SubMemu
const asBasicSubMenu = flow(
  asSubMenu,
  asTitledItem,
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
  withDesign({
    Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
    Item: addClasses('w-1/3'),
  }),
);

const asColumnSubMenu = flow(
  asSubMenu,
  asTitledItem,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asGroup,
  }),
  withDesign({
    Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
    Item: addClasses('w-1/3'),
  }),
  asHorizontalSubMenu,
  withMenuSublistStyles,
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
  asMenu,
  withDesign({
    // Title: asChamelionTitle,
    Title: asMenuLink(withEditorSimple),
    Item: asChamelionSubMenu,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  // The following is just to add classes to the active link to ensure that the
  // title design is passed through the chamelion.
  withDesign({
    Title: withDesign({
      ActiveLink: addClasses('italic'),
    }),
    // Item: addClasses('inline-block'),
  }),
  asExceptMobile,
)(Fragment);

// const BasicSubMenu = asBasicSubMenu('ul');
// const ToutSubMenu = asToutSubMenu('ul');
//
// const ChamelionBasicSubMenu = flow(
//   asBodilessChamelion('cham-sublist'),
//   withDesign({
//     Basic: flow(replaceWith(BasicSubMenu), withTitle('Basic sub-menu')),
//   }),
// )(BasicSubMenu);

// const WrappedBasicSubMenu = (props: any) => <ToutSubMenu {...props} />;

// export default withSubmenu(ChamelionSubMenu)(Menu);
export default Menu;
