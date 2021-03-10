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

const withTransformStyles = asToken(
  addClasses('transform'),
  asElementToken('Transforms')('Transform'),
);

const withSlideInTranslateStyles = asToken(
  addClasses('-translate-x-full'),
  asElementToken('Transforms')('Translate'),
);

const withFullScreenStyles = asToken(
  withFullWidthStyles,
  withFullHeightStyles,
  withNoInsetStyles,
  asFixed,
  withFullZIndex,
);

const withSlideInAnimationStyles = asToken(
  withTransformStyles,
  withSlideInTranslateStyles,
  addClassesIf(useIsBurgerMenuHidden)('animate-slide-out'),
  addClassesIf(useIsBurgerMenuVisible)('animate-slide-in'),
  asElementToken('Transitions')('Animation'),
);

const withTogglerButtonStyles = asToken(
  withMaterialIconsFont,
  withPointerCursorStyles,
);

const withBurgerMenuTogglerStyles = withDesign({
  Button: withTogglerButtonStyles,
});

const withSlideInOutAnimation = withDesign({
  Wrapper: withSlideInAnimationStyles,
});

const asFullScreen = withDesign({
  Wrapper: withFullScreenStyles,
});

const withDefaultBackground = withDesign({
  Wrapper: withLightGrayBg,
});

const withDisabledTitleLink = withDesign({
  Title: asDisabled,
});

const asSlideLeft = asToken(
  withSlideInOutAnimation,
  asFullScreen,
  withDefaultBackground,
);

export default withBurgerMenuTogglerStyles;
export {
  asSlideLeft,
  withDisabledTitleLink,
};