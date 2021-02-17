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
import { flow, omit } from 'lodash';
import { useEditContext } from '@bodiless/core';
import {
  addClasses,
  removeClassesIf,
  addClassesIf,
  withDesign,
  TokenDef,
  asToken,
  Design,
} from '@bodiless/fclasses';

import { useIsMenuOpen } from './withMenuContext';

export const withSubMenuToken = <P extends object>(
  ...keys: string[]
) => (...tokenDefs: TokenDef<P>[]) => {
    const design: Design<any> = keys.reduce((acc, key) => ({
      ...acc,
      [key]: asToken(...tokenDefs),
    }), {});

    const withSubMenuDesign = withDesign({
      Item: withDesign(omit(design, 'Main')),
    });

    /* eslint-disable dot-notation */
    return design['Main']
      ? asToken(design['Main'], withSubMenuDesign)
      : withSubMenuDesign;
  };

/*
 * Utility Styles
 * ===========================================
 */
const isContextActive = () => {
  const { isActive, isEdit } = useEditContext();
  return isEdit && isActive;
};

const isContextNotActive = () => {
  const { isActive, isEdit } = useEditContext();
  return isEdit ? !isActive : true;
};

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
    WrapperItem: addClassesIf(isContextActive)('overflow-visible'),
  }),
});

const asResponsiveSublist = withDesign({
  Wrapper: withDesign({
    List: addClasses('min-w-full'),
  }),
});

const asStaticOnHover = withDesign({
  Wrapper: withDesign({
    WrapperItem: flow(
      addClasses('hover:static'),
      removeClassesIf(useIsMenuOpen)('hover:static'),
    ),
  }),
});

const asRelativeNotActive = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClassesIf(isContextNotActive)('relative'),
  }),
});

const asFullWidthSublist = withDesign({
  Wrapper: withDesign({
    List: addClasses('w-full'),
  }),
});

/*
 * Base Menu Styles
 * ===========================================
 */
const withHoverStyles = withDesign({
  Item: flow(
    addClasses('hover:overflow-visible'),
    removeClassesIf(useIsMenuOpen)('hover:overflow-visible'),
  ),
});

const withBaseMenuStyles = flow(
  withHoverStyles,
  withDesign({
    Wrapper: addClasses('relative flex'),
    Item: addClasses('overflow-hidden'),
  }),
);

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
 * Touts Sub Menu Styles
 * ===========================================
 */
const asToutsSubMenu = flow(
  asFullWidthSublist,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
);

/*
 * Columns Sub Menu Styles
 * ===========================================
 */
const asColumnSubMenu = flow(
  asFullWidthSublist,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
);

export const asTopNav = (...keys: string[]) => {
  const listSubmenuStyles = keys.indexOf('List') > -1 ? asSimpleSubMenu : asToken();
  const toutsSubmenuStyles = keys.indexOf('Touts') > -1 ? asToutsSubMenu : asToken();
  const columnsSubmenuStyles = keys.indexOf('Columns') > -1 ? asColumnSubMenu : asToken();

  return asToken(
    withSubMenuToken('Main')(withBaseMenuStyles),
    withSubMenuToken('List')(listSubmenuStyles),
    withSubMenuToken('Touts')(toutsSubmenuStyles),
    withSubMenuToken('Columns')(columnsSubmenuStyles),
  );
};
