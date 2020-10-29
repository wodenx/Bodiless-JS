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
import { withDesign, addClasses } from '@bodiless/fclasses';

import { asBold, withPadding3 } from '../Elements.token';

/**
 * Base Burger Menu Styles
 * ===========================================
 */
const withBaseBurgerMenuStyles = withDesign({
  Wrapper: withPadding3,
});

/**
 * Base Burger Sub Menu Styles
 * ===========================================
 */
const withBaseBurgerSubMenuStyles = withDesign({
  Wrapper: withDesign({
    Title: withDesign({
      Label: asBold,
    }),
  }),
  Item: addClasses('pl-3'),
});

/**
 * Simple Burger Menu Styles
 * ===========================================
 */
const withSimpleBurgerMenuStyles = flow(
  withDesign({
    Item: withDesign({
      SubMenu: withBaseBurgerSubMenuStyles,
    }),
  }),
  withBaseBurgerMenuStyles,
);

export default withSimpleBurgerMenuStyles;
export {
  withBaseBurgerMenuStyles,
  withBaseBurgerSubMenuStyles,
};
