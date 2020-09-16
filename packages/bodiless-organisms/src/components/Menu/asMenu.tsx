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

import { ComponentType } from 'react';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
// import Menu, { ItemGroup, Item as MenuItem, SubMenu } from './RCMenu';
import { ifEditable, withExtendHandler } from '@bodiless/core';
import { asTitledItem } from '@bodiless/components';

export const asMenu = withDesign({
  Wrapper: replaceWith(stylable(Menu as ComponentType<MenuProps>)),
});

export const asMenuItem = replaceWith(stylable(MenuItem));

export const withMenuItem = withDesign({
  Item: asMenuItem,
});

export const asSubMenu = flow(
  withDesign({
    Wrapper: replaceWith(stylable(SubMenu)),
  }),
  asTitledItem,
);

export const asMenuItemGroup = flow(
  withDesign({
    Item: replaceWith(stylable(MenuItem)),
    Wrapper: replaceWith(stylable(ItemGroup)),
  }),
  asTitledItem,
);

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation();
};

export const asSubMenuTitle = ifEditable(
  // Prevent clicks on the submenu from closing the submenu
  withExtendHandler('onClick', () => stopPropagation),
);
