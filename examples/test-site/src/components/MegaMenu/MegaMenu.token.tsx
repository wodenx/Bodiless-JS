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
import { asHorizontalSubMenu, asHorizontalMenu, asToutHorizontal } from '@bodiless/organisms';
import { withDesign, addProps, addClasses } from '@bodiless/fclasses';
import { withMenuSublistStyles, withMenuListStyles } from '../Menus/token';
import { asExceptMobile } from '../Elements.token';
import './megamenu.css';
import { asToutWithPaddings, asToutDefaultStyle } from '../Tout/token';

const withMegaMenuStyles = withDesign({
  // @TODO: We add the class here to style rc-menu. Maybe can use design API if we ditch rc-menu.
  Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
  // @TODO: What's the best starting width? They will shrink to fit if there are more.
  Item: addClasses('w-1/3'),
});

const withColumnStyles = flow(
  withMenuSublistStyles,
);

const withBasicSubMenuStyles = flow(
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const withToutSubMenuStyles = flow(
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

const withColumnSubMenuStyles = flow(
  withDesign({
    Item: withColumnStyles,
  }),
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

const withChameleonSubMenuStyles = withDesign({
  Basic: withBasicSubMenuStyles,
  Touts: withToutSubMenuStyles,
  Columns: withColumnSubMenuStyles,
});

const withMenuStyles = flow(
  withDesign({
    Item: withChameleonSubMenuStyles,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
);

const withSimpleSubMenuStyles = withDesign({
  Basic: withBasicSubMenuStyles,
});

export const withSimpleMenuStyles = flow(
  withDesign({
    Item: withSimpleSubMenuStyles,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
);

export const withMenuToutStyles = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

export default withMenuStyles;
