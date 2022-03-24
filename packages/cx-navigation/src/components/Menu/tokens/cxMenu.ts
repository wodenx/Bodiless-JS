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
  addProps,
  as,
  on,
} from '@bodiless/fclasses';
import {
  withMenuDesign,
  withListSubMenu,
} from '@bodiless/navigation';
import { withNodeKey } from '@bodiless/core';
import { cxColor, cxFontSize, cxTextDecoration } from '@bodiless/cx-elements';
import { asMenuToken } from '../MenuClean';
import { cxMenuTitle, MenuTitleClean } from '../../MenuTitle';
import { cxSubMenu } from '../../SubMenu';
import { cxSeparator } from '../../Separator';

/**
 * Token which produces the Base CanvasX Menu. Can be customized and
 * extended to produce TopNav, Burger, Footer, etc...
 *
 * This basic menu does not contain submenus.
 */
const Base = asMenuToken({
  // @TODO: Do we need this?
  // Analytics: {
  //   _: withMenuTitleAnalytics,
  // }
  // @TODO: Why A11y domain is not working properly?
  A11y: {
    Nav: addProps({ role: 'navigation' }),
    Wrapper: addProps({ role: 'menubar' }),
    Item: addProps({ role: 'menuitem' }),
  },
  Components: {
    Title: on(MenuTitleClean)(cxMenuTitle.Default),
  },
});

/**
 * Token which produces a Default CanvasX Menu, with list submenus.
 */
const Default = asMenuToken({
  ...Base,
  Core: {
    _: withListSubMenu(),
  },
});

/**
 * Token which produces the CanvasX Utility Menu.
 */
const Utility = asMenuToken({
  ...Base,
  A11y: {
    Nav: addProps({ role: 'tablist' }),
  },
  A11yContent: {
    Nav: addProps({ 'aria-label': 'Utility Menu' }),
  },
  Theme: {
    Wrapper: 'flex',
    Title: as(
      cxSeparator.UtilityMenu,
      cxFontSize.Base,
    ),
  },
  Schema: {
    _: withNodeKey({ nodeKey: 'UtilityMenu', nodeCollection: 'site' }),
  },
});

/**
 * Token which produces the CanvasX Footer Menu.
 */
const Footer = asMenuToken({
  ...Default,
  A11yContent: {
    Nav: addProps({ 'aria-label': 'Footer Navigation Menu' }),
    Wrapper: addProps({ 'aria-label': 'Navigation Menu' }),
  },
  Components: {
    ...Default.Components,
    _: withMenuDesign('List')(as(cxSubMenu.Footer)),
  },
  Layout: {
    Nav: 'w-full lg:h-full',
    Wrapper: 'w-full md:flex md:justify-between md:flex-grow lg:h-full',
    Item: 'md:min-w-1/4 md:w-full',
  },
  Spacing: {
    Wrapper: 'lg:mb-12',
  },
  Theme: {
    // @TODO: This 'as' is needed only because of a bug and should be removed when it is fixed.
    // See https://github.com/johnsonandjohnson/Bodiless-JS/issues/1455
    Item: as(cxSeparator.FooterMenu),
    Title: as(
      cxColor.TextPrimaryFooterCopy,
      cxTextDecoration.Bold,
      // @todo should we use tokens here?
      'text-m-xl md:text-m-lg lg:text-base',
    ),
  },
});

/**
 * Token which produces the CanvasX Top Navigation Menu.
 */
const TopNav = asMenuToken({
  ...Default,
  Components: {
    ...Default.Components,
    _: withMenuDesign('List')(as(cxSubMenu.TopNav)),
  },
  // @TODO: Improve theme, layout, and spacing.
  Theme: {
    Wrapper: 'flex',
    Title: 'px-6',
  },
  Schema: {
    _: withNodeKey({ nodeKey: 'MainMenu', nodeCollection: 'site' }),
  },
});

/**
 * Token which produces the CanvasX Burger Menu.
 *
 * Reuses top navigation schema to retrieve desktop menu data.
 */
const Burger = asMenuToken({
  ...Default,
  Components: {
    ...Default.Components,
    _: withMenuDesign('List')(as(cxSubMenu.Burger)),
  },
  // @TODO: Improve theme, layout, and spacing.
  Spacing: {
    Item: 'mb-12',
  },
  Theme: {
    Wrapper: 'flex flex-col',
    Item: as(
      cxColor.TextPrimaryHeaderCopy,
      cxFontSize.L,
      cxTextDecoration.Bold,
      cxTextDecoration.Uppercase,
    ),
  },
  Schema: {
    ...TopNav.Schema,
  },
});

export default {
  Base,
  Burger,
  Default,
  Footer,
  TopNav,
  Utility,
};
