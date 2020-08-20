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
import { List } from '@bodiless/components';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  asEditableMainMenu,
  asEditableMainSubMenu,
  withSubmenu,
  asMenuLink,
} from '@bodiless/organisms';
import {
  withDesign, addClasses, addProps,
} from '@bodiless/fclasses';
import { replaceWith } from '@bodiless/fclasses/src/Design';
import { withExtendHandler } from '@bodiless/core';
import { withEditorSimple } from '../../../components/Editors';
import { asExceptMobile } from '../../../components/Elements.token';
import './megamenu.css';

import { withMenuListStyles, withMenuSublistStyles } from '../../../components/Menus/token';
import asChamelionTitle from './asChamelionTitle';
import Tout from '../../../components/Tout';
import {
  asToutHorizontal,
  asToutDefaultStyle,
  asToutWithPaddings,
} from '../../../components/Tout/token';
import asBodilessChamelion from './Chamelion';

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

const MenuTout = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
)(Tout);

const SubMenu = flow(
  asEditableMainSubMenu,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
  asHorizontalSubMenu,
  withMenuSublistStyles,
)(List);

const ToutSubMenu = withDesign({
  Title: flow(
    replaceWith(MenuTout),
    withExtendHandler('onClick', () => stopPropagation),
  ),
  Wrapper: addProps({ popupClassName: 'container' }),
  Item: addClasses('w-1/3'),
})(SubMenu);



const sublistDesign = {
  Basic: flow(replaceWith(SubMenu)),
  Touts: flow(replaceWith(ToutSubMenu)),
};;

const ChamelionSubMenu = flow(
  asBodilessChamelion('cham-sublist', { component: 'Basic' }),
  withDesign(sublistDesign),
)(SubMenu);

const Menu = flow(
  asEditableMainMenu,
  withDesign({
    Title: asChamelionTitle,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  withDesign({
    Title: withDesign({
      ActiveLink: addClasses('italic'),
    }),
  }),
  asExceptMobile,
)(List);

export default withSubmenu(ChamelionSubMenu)(Menu);
