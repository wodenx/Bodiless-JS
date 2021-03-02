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
import { omit } from 'lodash';
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
import {
  asFlex, asOverflowHidden, asRelative, asAbsolute,
  asPositionedLeft, withFullWidthStyles, withColumnDirectionStyles,
} from '../token';

const { meta } = asToken;

/**
 * Helper which makes it easier to target a particular type of submenu.
 *
 * The first parameter is a list of the submenu key(s) to which the token
 * provided as a second argument should be applied.
 * It also accepts the special key 'Main' to apply the design to the top level menu.
 *
 * @param keys List of the submenu key(s) to which the token should be applied.
 * @param tokenDefs List of tokens to be applied to submenu design key(s).
 *
 * @return Desigh token that applies supplied list of tokens to the provided design keys.
 */
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
  Wrapper: withColumnDirectionStyles,
});

const asVisibleOnActive = asToken(
  addClassesIf(isContextActive)('overflow-visible'),
  meta.term('Layout')('Overflow'),
);

const asResponsiveSublist = withDesign({
  Wrapper: asToken(
    addClasses('min-w-full'),
    meta.term('Sizing')('Min-Width'),
  ),
});

const asStaticOnHover = asToken(
  addClasses('hover:static'),
  removeClassesIf(useIsMenuOpen)('hover:static'),
  meta.term('Layout')('Position'),
);

const asRelativeNotActive = asToken(
  addClassesIf(isContextNotActive)('relative'),
  meta.term('Layout')('Position'),
);

const asFullWidthSublist = withDesign({
  Wrapper: withFullWidthStyles,
});

const withHoverStyles = withDesign({
  Item: asToken(
    addClasses('hover:overflow-visible'),
    removeClassesIf(useIsMenuOpen)('hover:overflow-visible'),
    meta.term('Layout')('Overflow'),
  ),
});

/*
 * Base Menu Styles
 * ===========================================
 */
const withBaseMenuStyles = asToken(
  withHoverStyles,
  withDesign({
    Wrapper: asToken(asFlex, asRelative),
    Item: asOverflowHidden,
  }),
);

/*
 * Base Sub Menu Styles
 * ===========================================
 */
const withBaseSubMenuStyles = withDesign({
  Wrapper: asToken(asFlex, asAbsolute, asPositionedLeft),
});

/*
 * List Sub Menu Styles
 * ===========================================
 */
const asListSubMenu = asToken(
  asResponsiveSublist,
  asVerticalSubMenu,
  withBaseSubMenuStyles,
  asVisibleOnActive,
  asRelative,
  meta.term('Submenu')('List'),
);

/*
 * Touts Sub Menu Styles
 * ===========================================
 */
const asToutsSubMenu = asToken(
  asFullWidthSublist,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
  meta.term('Submenu')('Touts'),
);

/*
 * Columns Sub Menu Styles
 * ===========================================
 */
const asColumnSubMenu = asToken(
  asFullWidthSublist,
  asStaticOnHover,
  withBaseSubMenuStyles,
  asRelativeNotActive,
  meta.term('Submenu')('Columns'),
);

/**
 * Helper which allows specifying which submenu types should have default navigation styling added.
 *
 * @param keys List of the submenu key(s) to which the default menu styles be applied to.
 *
 * @return Token that applies default top navigation styles based on provided keys.
 */
export const asTopNav = (...keys: string[]) => {
  const listSubmenuStyles = keys.indexOf('List') > -1 ? asListSubMenu : asToken();
  const toutsSubmenuStyles = keys.indexOf('Touts') > -1 ? asToutsSubMenu : asToken();
  const columnsSubmenuStyles = keys.indexOf('Columns') > -1 ? asColumnSubMenu : asToken();

  return asToken(
    withSubMenuToken('Main')(withBaseMenuStyles),
    withSubMenuToken('List')(listSubmenuStyles),
    withSubMenuToken('Touts')(toutsSubmenuStyles),
    withSubMenuToken('Columns')(columnsSubmenuStyles),
  );
};
