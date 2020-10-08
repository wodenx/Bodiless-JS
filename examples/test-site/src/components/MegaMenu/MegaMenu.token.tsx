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
import { useEditContext } from '@bodiless/core';
import { asToutHorizontal } from '@bodiless/organisms';
import { withDesign, addClasses, addClassesIf } from '@bodiless/fclasses';

import { asToutWithPaddings, asToutDefaultStyle } from '../Tout/token';

/**
 * Utility Styles
 * ===========================================
 */
const isActive = () => useEditContext().isActive;
const isNotActive = () => !useEditContext().isActive;

const asVerticalSubMenu = withDesign({
  Wrapper: withDesign({
    List: addClasses('flex-col'),
  }),
});

const asStaticOnHover = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('hover:static'),
  }),
});

const asRelative = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('relative'),
  }),
});

const asRelativeNotActive = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClassesIf(isNotActive)('relative'),
  }),
});

const asExpandedOnActive = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClassesIf(isActive)('overflow-visible'),
  }),
});

const asFullWidthSublist = withDesign({
  Wrapper: withDesign({
    List: addClasses('w-full'),
  }),
});

const asResponsiveSublist = withDesign({
  Wrapper: withDesign({
    List: addClasses('min-w-full'),
  }),
});

/**
 * Base Menu Styles
 * ===========================================
 */
const withBaseMenuStyles = withDesign({
  Wrapper: addClasses('w-full relative flex bg-teal-600 text-white'),
  Item: addClasses('py-1 px-3 hover:bg-teal-500 overflow-hidden hover:overflow-visible min-w-100 leading-loose text-sm'),
});

/**
 * Base Sub Menu Styles
 * ===========================================
 */
const withBaseSubMenuStyles = withDesign({
  Wrapper: withDesign({
    List: addClasses('flex absolute left-0 bg-teal-600 text-white my-1 z-10'),
  }),
  Item: addClasses('py-1 px-3 hover:bg-teal-500 min-w-100 leading-loose text-sm'),
});

/**
 * Simple Sub Menu Styles
 * ===========================================
 */

const asSimpleSubMenu = flow(
  asResponsiveSublist,
  asVerticalSubMenu,
  withBaseSubMenuStyles,
  asExpandedOnActive,
  asRelative,
);

const asSimpleSubMenuStyles = withDesign({
  SubMenu: asSimpleSubMenu,
});

/**
 * Touts Sub Menu Styles
 * ===========================================
 */
export const withMenuToutStyles = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

const withToutStyles = withDesign({
  Item: addClasses('w-1/3'),
});

const asToutsSubMenu = flow(
  asFullWidthSublist,
  withToutStyles,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
);

/**
 * Columns Sub Menu Styles
 * ===========================================
 */
const asColumnSublist = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('relative'),
  }),
  Item: addClasses('pr-2 pl-5'),
});

// Since removeClasses doesn't work this will allow correct hover effects on column items.
const withColumnHoverEffect = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('hover:bg-teal-600'),
  }),
  Item: addClasses('hover:bg-teal-500'),
});

const withColumnStyles = flow(
  asColumnSublist,
  withColumnHoverEffect,
);

const asColumnSubMenu = flow(
  withDesign({
    Item: withColumnStyles,
  }),
  asFullWidthSublist,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
);

/**
 * Mega Menu Sub Menu Styles
 * ===========================================
 */

const asMegaMenuSubListStyles = withDesign({
  List: asSimpleSubMenu,
  Touts: asToutsSubMenu,
  Columns: asColumnSubMenu,
});

/**
 * Simple Menu Styles
 * ===========================================
 */
export const withSimpleMenuStyles = flow(
  withDesign({
    Item: asSimpleSubMenuStyles,
  }),
  withBaseMenuStyles,
);

/**
 * Mega Menu Styles
 * ===========================================
 */
export const withMegaMenuStyles = flow(
  withDesign({
    Item: asMegaMenuSubListStyles,
  }),
  withBaseMenuStyles,
);
