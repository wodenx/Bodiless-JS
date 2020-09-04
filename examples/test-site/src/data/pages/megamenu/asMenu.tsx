import React, {
  ComponentType, createContext, useContext,
} from 'react';
import type { MenuProps } from 'rc-menu';
import { replaceWith, withDesign, stylable } from '@bodiless/fclasses';
import { asStylableList } from '@bodiless/organisms';
import { flow } from 'lodash';
import { WithNodeKeyProps, ifToggledOn, ifToggledOff } from '@bodiless/core';
import Menu, { ItemGroup, Item as MenuItem, SubMenu } from 'rc-menu';
// import Menu, { ItemGroup, Item as MenuItem, SubMenu } from './RCMenu';
import asBodilessList, { asTitledItem, asSubList } from './asBodilessList';

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

/**
 * NOC which can be applied to a menu to display it as a plain list of links.
 *
 * @param Component
 */
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

/**
 * @private
 *
 * HOC which renders a menu as a list of plain links when wrapped in
 * @param asMenuType
 */
const asToggledMenu = (asMenuType: any) => flow(
  ifToggledOn(usePlainLinks)(
    asStylableList,
    asSubList,
  ),
  ifToggledOff(usePlainLinks)(
    asMenuType,
  ),
);

const asMenuBase = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDesign({
    Item: replaceWith(stylable(MenuItem)),
  }),
);

const asMenu = (nodeKeys?: WithNodeKeyProps) => flow(
  ifToggledOff(usePlainLinks)(
    withDesign({
      // The cast is necessary bc of an error in rc-menu types.
      Wrapper: replaceWith(stylable(Menu as ComponentType<MenuProps>)),
    }),
    asMenuBase(nodeKeys),
  ),
  ifToggledOn(usePlainLinks)(
    asStylableList,
    asBodilessList(),
  ),
);

export default asMenu;

export const asSubMenuList = flow(
  asSubList,
  asStylableList,
);

export const asSubMenu = flow(
  withDesign({
    Item: replaceWith(stylable(MenuItem)),
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
