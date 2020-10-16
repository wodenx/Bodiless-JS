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
import { withDesign, addClasses, addProps } from '@bodiless/fclasses';

import { asDefaultLogoStyle } from '../Layout/token';

/**
 * Base Menu Styles
 * ===========================================
 */
const withBaseBurgerMenuStyles = withDesign({
  Wrapper: addClasses('p-3 BURGER_WRAPPER'),
  Item: addClasses('BURGER_ITEM'),
  Title: addClasses('BURGER_TITLE'),
});

/**
 * Base Sub Menu Styles
 * ===========================================
 */
const withBaseBurgerSubMenuStyles = withDesign({
  Wrapper: withDesign({
    List: addClasses('BURGER_SUB_LIST'),
    WrapperItem: addClasses('BURGER_SUB_WRAPPER_ITEM'),
  }),
  Item: addClasses('pl-3 BURGER_SUB_ITEM'),
  Title: addClasses('BURGER_SUB_TITLE'),
});

const asSimpleBurgerSubMenuStyles = withDesign({
  SubMenu: withBaseBurgerSubMenuStyles,
});

const asBurgerMenu = withDesign({
  Wrapper: addClasses('bg-teal-600 py-1'),
  Header: flow(
    asDefaultLogoStyle,
    withDesign({ SiteReturn: addClasses('bg-teal-600') }),
  ),
  Menu: flow(
    addClasses('bg-gray-300'),
    addProps({ noOverlay: true, width: '100%', right: true }),
  ),
  // Body: addClasses('p-3 text-black'),
});

/**
 * Simple Burger Menu Styles
 * ===========================================
 */
const withBurgerMenuStyles = flow(
  withDesign({
    Item: asSimpleBurgerSubMenuStyles,
  }),
  withBaseBurgerMenuStyles,
);

export default withBurgerMenuStyles;
export {
  asBurgerMenu,
};
