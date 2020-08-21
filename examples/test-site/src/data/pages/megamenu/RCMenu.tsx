import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign } from '@bodiless/fclasses';
import { asStylableList } from '@bodiless/organisms';
import { asEditableList } from '@bodiless/components';
import { flow } from 'lodash';
import { ComponentType } from 'react';

const asMenuBase = flow(
  withDesign({
    Item: replaceWith(MenuItem),
  }),
  asEditableList,
  asStylableList,
);

const asMenu = flow(
  withDesign({
    // The cast is necessary bc of an error in rc-menu types.
    Wrapper: replaceWith(Menu as ComponentType<MenuProps>),
  }),
  asMenuBase,
);

export default asMenu;

export const asSubMenu = flow(
  withDesign({
    Wrapper: replaceWith(SubMenu),
  }),
  asMenuBase,
);

export const asMenuItemGroup = flow(
  withDesign({
    Wrapper: replaceWith(ItemGroup),
  }),
  asMenuBase,
);
