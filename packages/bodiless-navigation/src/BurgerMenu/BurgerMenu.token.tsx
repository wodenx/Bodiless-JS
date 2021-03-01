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

/**
 * Tokens
 * ===========================================
 */
const { meta } = asToken;

const withBurgerMenuTogglerStyles = withDesign({
  Button: asToken(
    addClasses('material-icons cursor-pointer'),
  ),
});

const withLightGrayBg = asToken(
  addClasses('bg-gray-200'),
  meta.term('Backgrounds')('Color'),
);

const withTransformStyles = asToken(
  addClasses('transform'),
  meta.term('Transforms')('Transform'),
);

const withSlideInTranslateStyles = asToken(
  addClasses('-translate-x-full'),
  meta.term('Transforms')('Translate'),
);

/**
 * Animations
 * ===========================================
 */
const withSlideInOutAnimation = withDesign({
  Wrapper: asToken(
    withTransformStyles,
    withSlideInTranslateStyles,
    addClassesIf(useIsBurgerMenuHidden)('animate-slide-out'),
    addClassesIf(useIsBurgerMenuVisible)('animate-slide-in'),
    meta.term('Transitions')('Animation'),
  ),
});

const asFullScreen = withDesign({
  Wrapper: addClasses('fixed top-0 left-0 w-full h-full z-full'),
});

const withDefaultBackground = withDesign({
  Wrapper: withLightGrayBg,
});

const asSlideLeft = asToken(
  withSlideInOutAnimation,
  asFullScreen,
  withDefaultBackground,
);

export default withBurgerMenuTogglerStyles;
export {
  asSlideLeft,
};
