import { ComponentType } from 'react';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
// import Menu, { ItemGroup, Item as MenuItem, SubMenu } from './RCMenu';
import { ifEditable, withExtendHandler } from '@bodiless/core';
import { asTitledItem } from './components/asBodilessList';

export const asMenu = withDesign({
  Wrapper: replaceWith(stylable(Menu as ComponentType<MenuProps>)),
});

export const withMenuItem = withDesign({
  Item: replaceWith(stylable(MenuItem)),
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
