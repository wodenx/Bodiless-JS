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

import {
  addClasses, addClassesIf, asToken, withDesign,
} from '@bodiless/fclasses';

import { useIsBurgerMenuVisible, useIsBurgerMenuHidden } from './BurgerMenuContext';
import {
  withLightGrayBg, withNoInsetStyles, withFullWidthStyles, withFullHeightStyles,
  asFixed, withFullZIndex, withMaterialIconsFont, withPointerCursorStyles,
  asElementToken, asDisabled,
} from '../token';

const withSlideInOutAnimation = withDesign({
  Wrapper: asToken(
    addClasses('transform -translate-x-full'),
    addClassesIf(useIsBurgerMenuHidden)('animate-slide-out'),
    addClassesIf(useIsBurgerMenuVisible)('animate-slide-in'),
    asElementToken('Transitions')('Animation'),
  ),
});

const asFullScreen = withDesign({
  Wrapper: asToken(
    withFullWidthStyles,
    withFullHeightStyles,
    withNoInsetStyles,
    asFixed,
    withFullZIndex,
  ),
});

const withDefaultBackground = withDesign({
  Wrapper: withLightGrayBg,
});

/**
 * A Token that adds styles to the Button component of Burger Menu Toggler.
 * Adds a material-icon class and pointer styles.
 *
 * @return Token that adds styles to the Button component.
 */
const withBurgerMenuTogglerStyles = withDesign({
  Button: asToken(
    withMaterialIconsFont,
    withPointerCursorStyles,
  ),
});

/**
 * A Token that disables pointer events on the Title element.
 *
 * @return Token that disables pointer events on the Title element.
 */
const withDisabledTitleLink = withDesign({
  Title: asDisabled,
});

/**
 * A Token that adds styles and transitions needed for a slide-in animation for the Burger menu.
 *
 * @return Token that applies required styles for slide-in animation.
 */
const asSlideLeft = asToken(
  withSlideInOutAnimation,
  asFullScreen,
  withDefaultBackground,
);

export {
  asSlideLeft,
  withDisabledTitleLink,
  withBurgerMenuTogglerStyles,
};
