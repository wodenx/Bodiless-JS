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
import { withSimpleMenuDesign } from '@bodiless/organisms';

import { asBold, withPadding3, asDisabled } from '../Elements.token';

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
const baseBurgerSubMenuStyles = {
  Wrapper: withDesign({
    Title: withDesign({
      Label: flow(
        asBold,
        asDisabled,
      ),
    }),
    List: addClasses('first-child:pl-3 flex flex-col'),
  }),
  Item: flow(
    addProps({ overviewLinkTitle: 'Overview' }),
    addClasses('pl-3'),
  ),
};

/**
 * Simple Burger Menu Styles
 * ===========================================
 */
const withSimpleBurgerMenuStyles = flow(
  withSimpleMenuDesign(baseBurgerSubMenuStyles),
  withBaseBurgerMenuStyles,
);

export default withSimpleBurgerMenuStyles;
export {
  withBaseBurgerMenuStyles,
  baseBurgerSubMenuStyles,
};
