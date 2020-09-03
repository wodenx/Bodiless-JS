import React, {
  ComponentType, createContext, useContext,
} from 'react';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign, stylable } from '@bodiless/fclasses';
import { asStylableList } from '@bodiless/organisms';
import { flow } from 'lodash';
import { WithNodeKeyProps } from '@bodiless/core';
import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
// import Menu, { ItemGroup, Item as MenuItem, SubMenu } from './RCMenu';
import asBodilessList, { asTitledItem } from './asBodilessList';

type MenuContextType = {
  showPlainLinks: boolean,
  parent?: MenuContextType,
};
const defaultMenuContext = {
  showPlainLinks: false,
};

const MenuContext = createContext<MenuContextType>(defaultMenuContext);

export const useMenuContext = () => useContext(MenuContext);

export const usePlainLinks = () => useMenuContext().showPlainLinks;

export const asPlainLinks = <P extends object>(Component: ComponentType<P>) => {
  const AsPlainLinks = (props: P) => {
    const newContext: MenuContextType = {
      showPlainLinks: true,
      parent: useMenuContext(),
    };
    return (
      <MenuContext.Provider value={newContext}>
        <Component {...props} />
      </MenuContext.Provider>
    );
  };
  return AsPlainLinks;
};

const asMenuBase = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDesign({
    Item: replaceWith(stylable(MenuItem)),
  }),
);

const asMenu = (nodeKeys?: WithNodeKeyProps) => flow(
  asMenuBase(nodeKeys),
  withDesign({
    // The cast is necessary bc of an error in rc-menu types.
    Wrapper: replaceWith(stylable(Menu as ComponentType<MenuProps>)),
  }),
);

export default asMenu;

export const asSubMenu = flow(
  asMenuBase(),
  withDesign({
    Wrapper: replaceWith(stylable(SubMenu)),
  }),
  asTitledItem,
);

export const asMenuItemGroup = flow(
  asMenuBase(),
  withDesign({
    Wrapper: replaceWith(stylable(ItemGroup)),
  }),
  asTitledItem,
);
