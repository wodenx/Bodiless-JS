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

import { asToutWithPaddings, asToutDefaultStyle, asToutHorizontal } from '../Tout/token';
import { withBaseBurgerMenuStyles, withBaseBurgerSubMenuStyles } from './SimpleBurgerMenu.token';

/**
 * DEBUG Styles
 * ===========================================
 */
const withBaseMenuDebugStyles = withDesign({
  Wrapper: addClasses('BURGER_WRAPPER'),
  Item: addClasses('BURGER_ITEM'),
  Title: addClasses('BURGER_TITLE'),
});

const baseDebugStyles = withDesign({
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

const columnDebugStyles = flow(
  withDesign({
    Item: baseDebugStyles,
  }),
  baseDebugStyles,
);

const asDebugStyles = withDesign({
  List: baseDebugStyles,
  Touts: baseDebugStyles,
  Columns: columnDebugStyles,
});

const withMegaBurgerDebugStyles = flow(
  withDesign({
    Item: asDebugStyles,
  }),
  withBaseMenuDebugStyles,
);

/**
 * Touts Sub Menu Styles
 * ===========================================
 */
const withMenuToutStyles = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

// const withToutStyles = withDesign({
//   Item: addClasses('w-1/3'),
// });

const asToutsSubMenu = flow(
  // withToutStyles,
  withBaseBurgerSubMenuStyles,
);

/**
 * Columns Sub Menu Styles
 * ===========================================
 */
// const withColumnHoverEffect = withDesign({
//   Wrapper: withDesign({
//     WrapperItem: addClasses('hover:bg-teal-600'),
//   }),
//   Item: addClasses('hover:bg-teal-500'),
// });

// const withColumnStyles = flow(
//   withDesign({
//     Item: addClasses('pr-2 pl-5 min-w-100'),
//   }),
//   // withColumnHoverEffect,
// );

const asColumnSubMenu = flow(
  withDesign({
    Item: withBaseBurgerSubMenuStyles,
  }),
  withBaseBurgerSubMenuStyles,
);

/**
 * Mega Menu Sub Menu Styles
 * ===========================================
 */

const asMegaMenuSubListStyles = withDesign({
  List: withBaseBurgerSubMenuStyles,
  Touts: asToutsSubMenu,
  Columns: asColumnSubMenu,
});

/**
 * Mega Menu Styles
 * ===========================================
 */
const withMegaBurgerMenuStyles = flow(
  withDesign({
    Item: asMegaMenuSubListStyles,
  }),
  withBaseBurgerMenuStyles,
);

export default withMegaBurgerMenuStyles;
export {
  withMenuToutStyles,
  withMegaBurgerDebugStyles,
};
