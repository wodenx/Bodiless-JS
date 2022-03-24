/**
 * Copyright © 2022 Johnson & Johnson
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
  cxColor,
  cxFontSize,
  cxTextDecoration,
} from '@bodiless/cx-elements';
import {
  // addClassesIf,
  addProps,
  as,
  flowHoc,
  // not,
  on,
  removeClassesIf,
} from '@bodiless/fclasses';
import {
  // isMenuContextActive,
  // useIsMenuOpen,
  useIsSubmenuExpanded,
} from '@bodiless/navigation';
import { withAnalyticsAttr } from '../../../util';
import { cxMenuTitle, MenuTitleClean } from '../../MenuTitle';
import { asSubMenuToken } from '../SubMenuClean';

const Base = asSubMenuToken({
  A11y: {
    Wrapper: addProps({ role: 'menu' }),
    Item: addProps({ role: 'menuitem' }),
  },
  Analytics: {
    Title: withAnalyticsAttr,
  },
  Components: {
    Title: on(MenuTitleClean)(cxMenuTitle.Default),
  },
});

const Footer = asSubMenuToken(Base, {
  Theme: {
    Title: as(
      cxTextDecoration.Uppercase,
      cxColor.TextPrimaryFooterCopy,
      'text-base',
      // @todo why is this not an available token in cxFontSize?
      'font-medium md:text-sm lg:text-xs',
    ),
    Item: 'leading-none',
  },
  Spacing: {
    Item: 'mt-5 lg:mt-3',
  },
});

// @TODO: Keep it opened as user is editing it.
const TopNav = asSubMenuToken({
  ...Base,
  // @TODO: Improve theme, layout, and spacing.
  Layout: {
    Wrapper: flowHoc(
      as('absolute w-40 left-0 top-full hidden group-hover:flex flex-col'),
      removeClassesIf(useIsSubmenuExpanded)('hidden'),
    ),
    Item: 'relative flex',
    _: flowHoc(
      as('relative group'),
      // addClassesIf(not(useIsMenuOpen))('hover:static'),
      // removeClassesIf(isMenuContextActive)('relative'),
    ),
  },
  Spacing: {
    Item: 'px-6 py-2',
  },
  Theme: {
    Wrapper: as(cxColor.BgPrimaryCard),
  },
});

// @TODO: Toggle burger submenu on click.
const Burger = asSubMenuToken({
  ...Base,
  // @TODO: Improve theme, layout, and spacing.
  Layout: {
    Wrapper: flowHoc(
      // as('hidden'),
      // removeClassesIf(useIsSubmenuExpanded)('hidden'),
    ),
  },
  Spacing: {
    Item: 'mt-10',
  },
  Theme: {
    Item: as(
      cxFontSize.Base,
      cxTextDecoration.Normal,
    ),
  },
});

export default {
  Base,
  Burger,
  Footer,
  TopNav,
};
