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
 * DEBUG Burger Menu Styles
 * ===========================================
 */
const withBaseMenuDebugStyles = withDesign({
  Wrapper: addClasses('BURGER_WRAPPER'),
  Item: addClasses('BURGER_ITEM'),
  Title: addClasses('BURGER_TITLE'),
});

const withBaseSubMenuDebugStyles = withDesign({
  Wrapper: withDesign({
    List: addClasses('ACCORDION_BODY'),
    Title: withDesign({
      Label: addClasses('ACCORDION_LABEL'),
    }),
    WrapperItem: addClasses('ACCORDION_WRAPPER'),
  }),
  Item: addClasses('BURGER_SUB_ITEM'),
  Title: addClasses('BURGER_SUB_TITLE'),
});

const asSimpleSubMenuDebugStyles = withDesign({
  SubMenu: withBaseSubMenuDebugStyles,
});

const withBurgerMenuDebugStyles = flow(
  withDesign({
    Item: asSimpleSubMenuDebugStyles,
  }),
  withBaseMenuDebugStyles,
);


/**
 * Base Burger Menu Styles
 * ===========================================
 */
const withBaseBurgerMenuStyles = withDesign({
  Wrapper: addClasses('p-3'),
});

/**
 * Base Sub Menu Styles
 * ===========================================
 */
const withBaseBurgerSubMenuStyles = withDesign({
  Wrapper: withDesign({
    Title: withDesign({
      Label: addClasses('font-bold'),
    }),
  }),
  Item: addClasses('pl-3'),
});

const asSimpleBurgerSubMenuStyles = withDesign({
  SubMenu: withBaseBurgerSubMenuStyles,
});

/**
 * Burger Menu Wrapper Styles
 * ===========================================
 */
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
  withBurgerMenuDebugStyles,
};
