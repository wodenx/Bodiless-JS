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

import { ifToggledOn } from '@bodiless/core';
import { asToken, withDesign, addClasses } from '@bodiless/fclasses';
import { asTopNav, useIsActiveTrail, withMenuDesign } from '@bodiless/navigation';

import {
  asBold, asLightTealBackground, asAlignLeft,
  asLightTealBackgroundOnHover, asTealBackground, asTextWhite,
} from '../Elements.token';
import { asUnderline } from '../ElementDefault.token';
import { asToutMainMenu } from '../Tout/token';

/**
 * Colors
 * ===========================================
 */

const withMenuBackground = asTealBackground;
const withActiveMenuBackground = asLightTealBackground;
const withHoverMenuBackground = asLightTealBackgroundOnHover;

/**
 * Title Styles
 * ===========================================
 */

const $withTitleStyles = withDesign({
  Title: asToken(
    withHoverMenuBackground,
    asAlignLeft,
    asTextWhite,
    addClasses('flex px-3'),
  ),
});

const withActiveTitleStyles = ifToggledOn(useIsActiveTrail)(
  withActiveMenuBackground, asBold, asUnderline,
);

const withActiveSubTitleStyles = ifToggledOn(useIsActiveTrail)(
  withActiveMenuBackground, asBold,
);

/**
 * Base Menu Styles
 * ===========================================
 */

const $withBaseMenuStyles = withDesign({
  Wrapper: asToken(
    withMenuBackground,
    addClasses('w-full'),
  ),
  Item: addClasses('leading-loose text-sm'),
  Title: withActiveTitleStyles,
});

/**
 * Base Sub Menu Styles
 * ===========================================
 */

const $withBaseSubMenuStyles = withDesign({
  Wrapper: asToken(
    withMenuBackground,
    addClasses('z-10'),
  ),
  Title: withActiveSubTitleStyles,
});

const $withListSubmenuStyles = withDesign({
  Wrapper: addClasses('w-content'),
});

const $withColumnsSublistStyles = withDesign({
  Title: addClasses('pl-6'),
});

const $withToutsSublistStyles = withDesign({
  Title: asToutMainMenu,
  Item: addClasses('w-1/3'),
});

const $asSiteNavStyles = asToken(
  asTopNav('List', 'Columns', 'Touts'),
  withMenuDesign()($withTitleStyles),
  withMenuDesign('Main')($withBaseMenuStyles),
  withMenuDesign(['List', 'Columns', 'Touts'])($withBaseSubMenuStyles),
  withMenuDesign('Columns', 2)($withColumnsSublistStyles),
  withMenuDesign('List')($withListSubmenuStyles),
  withMenuDesign('Touts')($withToutsSublistStyles),
);

export default $asSiteNavStyles;
