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

import React, { ComponentType, PropsWithChildren, Fragment, FC } from 'react';
import { flow, identity } from 'lodash';
import { List, Editable, asBodilessLink, withLinkToggle, asEditable } from '@bodiless/components';
import ContentEditable from 'react-contenteditable';
import { observer } from 'mobx-react-lite';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  withSubmenu,
  asMenuLink,
  MenuLink,
} from '@bodiless/organisms';

import {
  withDesign, addClasses, addProps,
} from '@bodiless/fclasses';
import { replaceWith } from '@bodiless/fclasses/src/Design';
import { withTitle } from '@bodiless/layouts';
import { useNode, NodeProvider, withNode, withNodeKey, withChild, withExtendHandler } from '@bodiless/core';
import { withEditorSimple } from '../../../components/Editors';
import { asExceptMobile } from '../../../components/Elements.token';

import { withMenuListStyles, withMenuSublistStyles } from '../../../components/Menus/token';
import asChamelionTitle from './asChamelionTitle';
import asBodilessChamelion from './Chamelion';
import asMenuTout from './MenuTout';
import asMenu, { asSubMenu, asMenuItemGroup } from './RCMenu';

const asTitledItem = <P extends object>(Item: ComponentType<PropsWithChildren<P>>) => {
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

const FixedTitle = () => {
  const { node } = useNode<{ text: string }>();
  const onInput = (event: any) => {
    const newText = event.currentTarget.innerHTML;
    node.setData({ text: newText });
  };
  const text = node.data.text !== undefined ? node.data.text : '';
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Editable />
      {/*
      <ContentEditable
        tagName="span"
        className="bodiless-inline-editable"
        html={text}
        onChange={onInput}
        placeholder="Placeholder"
      />
      */}
    </button>
  );
};

const asFixedTitle = flow(
  replaceWith(FixedTitle),
  observer,
  withNode,
  withNodeKey('editable'),
);

const FixedLink = (props: any) => <a {...props} />;

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

// const asMenuLink$ = (editable: any) => flow(
//   replaceWith(FixedLink),
//   asBodilessLink('title-link'),
//   withLinkToggle,
//   withExtendHandler('onClick', () => stopPropagation),
//   withNode, 
//   withNodeKey('title'),
//   editable('text', 'Menu Item'),
// );

const asGroup = flow(
  replaceWith(List),
  asMenuItemGroup,
  asTitledItem,
  withDesign({
    Title: asMenuLink(asEditable),
    // Title: withChild(FixedSpan),
    // Title: replaceWith(FixedLink),
    // TItle: asFixedTitle,
    // Title: asMenuLink$,
  }),
  // withMenuSublistStyles,
);

// Basic SubMemu
const asBasicSubMenu = flow(
  replaceWith(List),
  asSubMenu,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const asToutSubMenu = flow(
  asBasicSubMenu,
  withDesign({
    Title: asMenuTout,
  }),
  withDesign({
    Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
    Item: addClasses('w-1/3'),
  }),
);

const asColumnSubMenu = flow(
  replaceWith(List),
  asSubMenu,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asGroup,
  }),
  withDesign({
    Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
    Item: addClasses('w-1/3'),
  }),
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const ChamelionSubMenu = flow(
  asBodilessChamelion('cham-sublist', { component: 'Basic' }),
  withDesign({
    Basic: flow(asBasicSubMenu, withTitle('Basic sub-menu')),
    Touts: flow(asToutSubMenu, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubMenu, withTitle('Column sub-menu')),
  }),
)(Fragment);

const Menu = flow(
  asMenu,
  withDesign({
    Title: asChamelionTitle,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  withDesign({
    Title: withDesign({
      ActiveLink: addClasses('italic'),
    }),
  }),
  asExceptMobile,
)(List);

export default withSubmenu(ChamelionSubMenu)(Menu);
