/**
 * Copyright © 2019 Johnson & Johnson
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
import React, { ComponentType } from 'react';
import { flow, pick } from 'lodash';
import {
  addClasses,
  addProps,
  removeClasses,
  withDesign,
  replaceWith,
  stylable,
  HOC,
  withoutProps,
} from '@bodiless/fclasses';
import {
  asEditable,
  List,
  withSublist,
  Link,
  Editable,
  asEditableList,
  withLinkToggle,
} from '@bodiless/components';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  asEditableMainMenu,
  asEditableMainSubMenu,
  withSubmenu,
} from '@bodiless/organisms';
import { withNode, withNodeKey } from '@bodiless/core';
import { asExceptMobile, asEditableLink } from '../Elements.token';

const asWhiteColoredLink = flow(
  removeClasses('bl-text-primary hover:bl-underline'),
  addClasses('text-white'),
);
const withActivePageStyles = addClasses('bg-teal-500');
const withLinkStyles = withDesign({
  ActiveLink: flow(asWhiteColoredLink, withActivePageStyles),
  Link: asWhiteColoredLink,
});

const sublistPropsToKeep = [
  'children',
  'unwrap', 
  'nodeKey',
  'design',
];

const keepProps = (propsToKeep?: string[]) => <P extends object>(Component: ComponentType<P>) => (props: P) => {
  console.log('keepProps', Object.keys(props));
  const newProps = propsToKeep ? pick(props, propsToKeep) : props;
  return <Component {...newProps as P}  />;
}
  
// const LinkTitle = (props: any) => (
//   <Link nodeKey="link" {...props}><Editable nodeKey="text" placeholder="Item" /></Link>
// );
// /**
//  * This is an editable list using our simple editable title.
//  */
// const EditableLinkList = flow(
//   keepProps(sublistPropsToKeep),
//   asEditableList,
//   withDesign({
//     Title: flow(
//       replaceWith(LinkTitle),
//       asWhiteColoredLink,
//       addClasses('pl-5'),
//     ),
//     // Wrapper: flow(stylable, addClasses('pl-5')),
//   }),
// )(List);

type AsEditable = (nodeKey?: string, placeholder?: string) => HOC;

// TODO Export this from bodiless-components?
const withEditableTitle = (editable: AsEditable) => withDesign({
  Title: flow(
    asEditableLink('title-link'),
    withLinkToggle,
    withNode,
    withNodeKey('title'),
    editable('text', 'Menu Item'),
  ) as HOC,
});

const EditableLinkList = flow(
  keepProps(sublistPropsToKeep),
  asEditableList,
  withEditableTitle(asEditable),
  withDesign({
    Wrapper: flow(stylable, addClasses('pl-5')),
    Title: withLinkStyles,
  }),
)(List);

const withMenuStyles = addClasses('hover:bg-teal-500 text-white text-left min-w-100 leading-loose text-sm px-2');
const withTealBackground = addClasses('bg-teal-600');
const withLimitedHeightStyles = addClasses('overflow-y-hidden max-h-menu-row');
const withSubmenuStyles = addClasses('-ml-2');
const MenuSubList = flow(
  asEditableMainSubMenu(asEditable),
  asHorizontalSubMenu,
  withDesign({
    Title: withLinkStyles,
    Wrapper: flow(
      withTealBackground,
      withMenuStyles,
    ),
    Item: flow(
      withMenuStyles,
      withTealBackground,
      withSubmenuStyles,
    ),
  }),
)(List);

const CompoundMenuSubList = withSublist(EditableLinkList)(MenuSubList);

const MenuList = flow(
  asEditableMainMenu(asEditable),
  asHorizontalMenu,
  withDesign({
    Title: withLinkStyles,
    Wrapper: flow(
      withTealBackground,
      addProps({ overflowedIndicator: <span className="text-white">...</span> }),
      withLimitedHeightStyles,
    ),
    Item: flow(
      withTealBackground,
      withMenuStyles,
    ),
  }),
  asExceptMobile,
)(List);

export default withSubmenu(CompoundMenuSubList)(MenuList);
