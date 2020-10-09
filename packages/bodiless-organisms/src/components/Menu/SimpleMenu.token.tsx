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
import { withDesign, addClasses, addClassesIf } from '@bodiless/fclasses';

/*
 * Utility Styles
 * ===========================================
 */
const isActive = () => useEditContext().isActive;

const asVerticalSubMenu = withDesign({
  Wrapper: withDesign({
    List: addClasses('flex-col'),
  }),
});

const asRelative = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('relative'),
  }),
});

const asExpandedOnActive = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClassesIf(isActive)('overflow-visible'),
  }),
});

const asResponsiveSublist = withDesign({
  Wrapper: withDesign({
    List: addClasses('w-content min-w-full'),
  }),
});

/*
 * Base Menu Styles
 * ===========================================
 */
const withBaseMenuStyles = withDesign({
  Wrapper: addClasses('relative flex'),
  Item: addClasses('overflow-hidden hover:overflow-visible'),
});

/*
 * Base Sub Menu Styles
 * ===========================================
 */
const withBaseSubMenuStyles = withDesign({
  Wrapper: withDesign({
    List: addClasses('flex absolute left-0'),
  }),
});

/*
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

/*
 * Simple Menu Sub Menu Styles
 * ===========================================
 */
const asSimpleSubMenuStyles = withDesign({
  SubMenu: asSimpleSubMenu,
});

/*
 * Simple Menu Styles
 * ===========================================
 */
const asSimpleMenu = flow(
  withDesign({
    Item: asSimpleSubMenuStyles,
  }),
  withBaseMenuStyles,
);

export default asSimpleMenu;
export {
  withBaseSubMenuStyles,
  withBaseMenuStyles,
  asSimpleSubMenu,
  asRelative,
};
