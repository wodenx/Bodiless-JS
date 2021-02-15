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
import {
  Token, asToken, withDesign, addClasses,
} from '@bodiless/fclasses';
// import { useIsActiveTrail } from '@bodiless/organisms';
import {
  asTopNav, withSubMenuToken, withColumnSubMenuDesign,
} from '@bodiless/navigation';

// import { ifToggledOn } from '@bodiless/core';
import {
  // asBold, asLightTealBackground,
  asLightTealBackgroundOnHover, asTealBackground, asTextWhite,
  asAlignLeft,
} from '../Elements.token';
// import { asUnderline } from '../ElementDefault.token';

/**
 * Colors
 * ===========================================
 */

const withMenuBackground = asTealBackground;
// const withActiveMenuBackground = asLightTealBackground;
const withHoverMenuBackground = asLightTealBackgroundOnHover;
// const withMenuForeground = asTextWhite;

/**
 * Title Styles
 * ===========================================
 */

const $withTitleStyles = withDesign({
  Title: asToken(
    withHoverMenuBackground,
    asAlignLeft,
    asTextWhite,
    addClasses('px-3'),
  ),
}) as Token;

// const withActiveTitleStyles = ifToggledOn(useIsActiveTrail)(
//   withActiveMenuBackground, asBold, asUnderline,
// );

// const withActiveSubTitleStyles = ifToggledOn(useIsActiveTrail)(
//   withActiveMenuBackground, asBold,
// );

/**
 * Base Menu Styles
 * ===========================================
 */

const $withBaseMenuStyles = withDesign({
  Wrapper: flow(
    withMenuBackground,
    addClasses('w-full'),
  ),
  Item: addClasses('leading-loose text-sm'),
});

/**
 * Base Sub Menu Styles
 * ===========================================
 */

const $withBaseSubMenuStyles = withDesign({
  Wrapper: withDesign({
    List: flow(
      withMenuBackground,
      addClasses('z-10'),
    ),
  }),
}) as Token;

const $withColumnsSublistStyles = withColumnSubMenuDesign($withTitleStyles) as Token;

const $asSiteNavStyles = asToken(
  asTopNav('List', 'Columns', 'Touts'),
  $withBaseMenuStyles as Token,
  withSubMenuToken('Main', 'List', 'Columns', 'Touts')($withTitleStyles, $withBaseSubMenuStyles) as Token,
  withSubMenuToken('Columns')($withColumnsSublistStyles) as Token,
);

export default $asSiteNavStyles;
