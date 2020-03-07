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

/**
 * @file
 * This file demostrates creation of a multi-column "Mega Menu"
 */
// TODO: Refactor to use rc-menu menu groups rather than embedded sublist.

import React, { ComponentType, PropsWithChildren, FC } from 'react';
import { flow, pick } from 'lodash';
import {
  withLinkToggle,
  asEditableList,
  asEditable,
  ListProps,
  withToggleTo,
  ListDesignableComponents,
  withToggleButton,
} from '@bodiless/components';
import { withNode, withNodeKey } from '@bodiless/core';
import {
  withDesign, addClasses, HOC,
} from '@bodiless/fclasses';
import { asEditableLink } from '../Elements.token';

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

// TODO: Export these (from bodiless-components)?
// This is curently just copied from bodiless-organisms, but uses the site
// token asEditableLink. This whole pattern could be improved.
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

// The sublist that will go in each column.
const asColumnSubList = flow(
  pickProps(sublistPropsToKeep),
  asEditableList,
  withEditableTitle(asEditable),
);

// TODO: Make this generic: allow alternate component to render the item with sublist.
// TODO: Refactor to use rc-menu MenuGroup rather than embedded sublist.
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

const withColumnSubList = (Sublist: ComponentType<ListProps>) => (
  withDesign<ListDesignableComponents>({
    ItemMenuOptionsProvider: withToggleButton({ icon: 'playlist_add' }),
    Item: withColumnSublistToggle(Sublist),
  })
);

export { withColumnSubList, asColumnSubList };
