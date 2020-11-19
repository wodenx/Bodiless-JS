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

import React, { FC, ComponentType } from 'react';
import { flow } from 'lodash';
import {
  withPageDimensionsContext, ifViewportIsNot, asHiddenBreadcrumbSource,
  withRemoveOnEffect,
  ifViewportIs,
} from '@bodiless/components';
import {
  withDesign,
  designable,
  DesignableComponentsProps,
  Div,
  Fragment,
  replaceWith,
} from '@bodiless/fclasses';

import { withNode } from '@bodiless/core';
import SimpleMenu from './SimpleMenu';
import MegaMenu from './MegaMenu';

import { SimpleBurgerMenu, MegaBurgerMenu } from '../BurgerMenu';
import { breakpoints } from '../Page';

type MenuComponents = {
  SSRBreadcrumbSource: ComponentType<any>,
  MobileMenu: ComponentType<any>,
  DesktopMenu: ComponentType<any>,
};

const menuComponentsStart:MenuComponents = {
  SSRBreadcrumbSource: Fragment,
  DesktopMenu: Div,
  MobileMenu: Div,
};

const canUseDOM = () => !!(
  typeof window !== 'undefined'
  && window.document
  && window.document.createElement
);

const isSSR = () => !canUseDOM();

const ResponsiveMenuBase: FC<DesignableComponentsProps<MenuComponents>> = props => {
  const { components, ...rest } = props;
  const { MobileMenu, DesktopMenu, SSRBreadcrumbSource } = components;

  return (
    <nav aria-label="Navigation Menu">
      {isSSR() && <SSRBreadcrumbSource {...rest} />}
      <MobileMenu {...rest} />
      <DesktopMenu {...rest} />
    </nav>
  );
};

const ResponsiveMenuClean = designable<any>(menuComponentsStart)(ResponsiveMenuBase);

const withMenus = ({ DesktopMenu, MobileMenu }: Partial<MenuComponents>) => flow(
  withDesign({
    SSRBreadcrumbSource: flow(
      replaceWith(DesktopMenu),
      asHiddenBreadcrumbSource,
    ),
    DesktopMenu: flow(
      replaceWith(DesktopMenu),
      ifViewportIsNot(['lg', 'xl', 'xxl'])(withRemoveOnEffect),
    ),
    MobileMenu: flow(
      replaceWith(MobileMenu),
      ifViewportIs(['lg', 'xl', 'xxl'])(withRemoveOnEffect),
    ),
  }),
  withPageDimensionsContext({ breakpoints }),
  withNode,
);

const ResponsiveSimpleMenu = withMenus({
  DesktopMenu: SimpleMenu,
  MobileMenu: SimpleBurgerMenu,
})(ResponsiveMenuClean);

const ResponsiveMegaMenu = withMenus({
  DesktopMenu: MegaMenu,
  MobileMenu: MegaBurgerMenu,
})(ResponsiveMenuClean);

export {
  ResponsiveSimpleMenu,
  ResponsiveMegaMenu,
};
