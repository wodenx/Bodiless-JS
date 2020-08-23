import React, { ComponentType, PropsWithChildren } from 'react';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign, stylable } from '@bodiless/fclasses';
import { asStylableList } from '@bodiless/organisms';
import { asEditableList, List } from '@bodiless/components';
import { flow } from 'lodash';
import { useNode, NodeProvider } from '@bodiless/core';
import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
// import Menu, { ItemGroup, Item as MenuItem, SubMenu } from './RCMenu';

export const asTitledItem = <P extends object>(Item: ComponentType<PropsWithChildren<P>>) => {
  const TitledItem: ComponentType<P> = ({ children, ...rest }) => {
    // prepare and pass the submenu title as a prop according to rc-menu <SubMenu /> specification
    // wrap the title with current node,
    // otherwise the title will read data from incorrect node when it is rendered by <SubMenu />
    const { node } = useNode();
    const children$ = <NodeProvider node={node}>{children}</NodeProvider>;
    return (
      <Item title={children$} {...rest as any} />
    );
  };
  return TitledItem;
};

const asMenuBase = flow(
  replaceWith(List),
  asEditableList,
  withDesign({
    Item: replaceWith(MenuItem),
  }),
  asStylableList,
);

const asMenu = flow(
  asMenuBase,
  withDesign({
    // The cast is necessary bc of an error in rc-menu types.
    Wrapper: replaceWith(stylable(Menu as ComponentType<MenuProps>)),
  }),
);

export default asMenu;

export const asSubMenu = flow(
  asMenuBase,
  withDesign({
    Wrapper: replaceWith(stylable(SubMenu)),
  }),
  asTitledItem,
);

export const asMenuItemGroup = flow(
  asMenuBase,
  withDesign({
    Wrapper: replaceWith(stylable(ItemGroup)),
  }),
  asTitledItem,
);
