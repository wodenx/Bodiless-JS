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
import React, { ComponentType, PropsWithChildren, FC } from 'react';
import { flow, pick } from 'lodash';
import {
  addClasses,
  addProps,
  removeClasses,
  withDesign,
  stylable,
  HOC,
} from '@bodiless/fclasses';
import {
  asEditable,
  List,
  asEditableList,
  withLinkToggle,
  ListProps,
  withToggleTo,
  withToggleButton,
  ListDesignableComponents,
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

// TODO: THis is hackery to get rid of unwanted rc-menu props. Find a better way.
const sublistPropsToKeep = [
  'children',
  'unwrap',
  'nodeKey',
  'design',
];

/**
 * HOC to remove all but the specified props.
 */
const pickProps = (propsToPick?: string[]) => (
  <P extends object>(Component: ComponentType<P>) => (props: P) => {
    const newProps = propsToPick ? pick(props, propsToPick) : props;
    return <Component {...newProps as P} />;
  }
);

// TODO Export these from bodiless-components?
type AsEditable = (nodeKey?: string, placeholder?: string) => HOC;
const withEditableTitle = (editable: AsEditable) => withDesign({
  Title: flow(
    asEditableLink('title-link'),
    withLinkToggle,
    withNode,
    withNodeKey('title'),
    editable('text', 'Menu Item'),
  ) as HOC,
});

const ColumnSubList = flow(
  pickProps(sublistPropsToKeep),
  asEditableList,
  withEditableTitle(asEditable),
  withDesign({
    Wrapper: flow(stylable, addClasses('pl-5')),
    // @ts-ignore
    Title: withLinkStyles,
  }),
)(List);

// TODO: Make this generic: allow alternate component to render the item with sublist.
// This duplicates a lot of the code in withSublist.  We need to improve that code
// so that it adds an "ItemWithSublist" component to the design.
const withColumnSublistToggle = (Sublist: ComponentType<ListProps>) => (
  (Item: ComponentType<PropsWithChildren<{}>> | string) => {
    const ItemWithSublist: FC<ListProps> = ({
      children, unwrap, nodeKey, ...rest
    }) => (
      <Item {...rest}>
        {children}
        <Sublist unwrap={unwrap} nodeKey="sublist" />
      </Item>
    );
    // TODO: Why is this type-cast necessary?
    return withToggleTo(Item)(addClasses('inline-block')(ItemWithSublist as ComponentType));
  }
);

const withColumnSublist = (Sublist: ComponentType<ListProps>) => (
  withDesign<ListDesignableComponents>({
    ItemMenuOptionsProvider: withToggleButton({ icon: 'playlist_add' }),
    Item: withColumnSublistToggle(Sublist),
  })
);


// @ts-ignore
const CompoundMenuSubList = withColumnSublist(ColumnSubList)(MenuSubList);

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
