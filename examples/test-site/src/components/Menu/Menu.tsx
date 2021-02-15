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
  asBodilessMenu, withListSubMenu, withColumnSubMenu, withToutSubMenu,
  withSubMenuToken, asTopNav,
  // asMenuTout,
} from '@bodiless/navigation';
import { Token, withDesign, addClasses } from '@bodiless/fclasses';

import { asEditableTout } from '../Tout';

export const $asEditableMenuTout = flow(
  // asMenuTout(),
  asEditableTout,
);

// const $withListStyles = withDesign({
//   Wrapper: flow(
//     addClasses('L:WRAPPER'),
//     withDesign({
//       List: addClasses('L:WRAPPER__LIST'),
//       WrapperItem: addClasses('L:WRAPPER__ITEM'),
//       Title: addClasses('L:WRAPPER__TITLE')
//     }),
//   ),
//   Item: addClasses('L:ITEM'),
//   Title: addClasses('L:TITLE pl-4'),
// });

// const $withMainStyles = withDesign({
//   Wrapper: addClasses('M:WRAPPER'),
//   Item: addClasses('M:ITEM'),
//   Title: addClasses('M:TITLE'),
// });

const $withGeneralStyles = withDesign({
  Title: addClasses('G:TITLE'),
}) as Token;

const BodilessMenuBase = flow(
  asBodilessMenu('MainMenu'),
  withListSubMenu(),
  withColumnSubMenu(),
  withToutSubMenu($asEditableMenuTout),
  // withSubMenuToken('List')($withListStyles),
  // withSubMenuToken('Main')($withMainStyles),
  withSubMenuToken('Main', 'List', 'Columns', 'Touts')($withGeneralStyles),
  asTopNav('List', 'Columns', 'Touts'),
)('ul') as ComponentType<any>;

const BodilessMenu = flow(
  // withSimpleMenuStyles,
  // asBreadcrumbSource,
  // asSimpleMenuTopNav,
)(BodilessMenuBase);

export default BodilessMenu;
