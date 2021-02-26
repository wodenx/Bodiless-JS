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

import {
  WithNodeKeyProps, withNodeKey, WithNodeProps, useNode, NodeProvider,
} from '@bodiless/core';
import React, {
  ComponentType, FC,
} from 'react';
import { flow, identity } from 'lodash';
import {
  replaceWith, withDesign, asComponent, HOC,
  withoutProps,
} from '@bodiless/fclasses';

import withListButtons from './withListButtons';
import BodilessList from './List';
import { Data, UseListOverrides, FinalProps as ListProps } from './types';

type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;

/**
 * Converts a component or tag to a "bodiless" list. The component itself (usually
 * a variant of 'ul' or 'ol') will be used as the wrapper for the list, and the data
 * will be taken from bodiless data.
 *
 * @param nodeKeys
 */
const asBodilessList = <P extends object>(
  nodeKeys?: WithNodeKeyProps,
  // @TODO - Handle default data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultData?: Data,
  useOverrides?: UseListOverrides<P>,
) => (Component: ComponentOrTag<P>): ComponentType<P & WithNodeProps> => flow(
    replaceWith(BodilessList),
    withListButtons(useOverrides),
    withDesign({
      Wrapper: replaceWith(asComponent(Component)),
      Item: withoutProps(['addItem', 'deleteItem', 'canDelete']),
    }),
    withNodeKey(nodeKeys),
  )(Component);

type SubListTitleProps = {
  title: React.ReactNode,
};

type SubListProps = Omit<ListProps, 'title'|'nodeKey'> & SubListTitleProps;

/**
 * @private
 * HOC which can be applied to a list wrapper so that it accepts a `title` prop
 * which is rendered alongside the wrapper itself.
 *
 * By using this in our sublist we make it possible to replace the sublist
 * wrapper with some other component which accepts a title (eg, the SubMenu
 * component from rc-menu).
 *
 * @param
 * Wrapper The list wrapper component tow hich this HOC will apply.
 *
 * @returs
 */
const withSubListTitle = (Wrapper: ComponentType<any>) => (
  { title, ...rest }: SubListTitleProps,
) => (
  <>
    {title}
    <Wrapper {...rest} />
  </>
);

/**
 * Creates an HOC which can be applied to a list item to convert it to a sublist.
 *
 * @param useOverrides
 * The overrides to use when creating the sublist edit buttons
 *
 * @return
 * HOC which converts a list item to a sublist.
 *
 * @example
 * ```ts
 * const aslistWithSubList = flow(
 *   asBodilessList('nodeKey'),
 *   withDesign({
 *     Item: asSubList(),
 *   }),
 * );
 * ```
 */
const asSubList = (useOverrides?: UseListOverrides) => (Item: ComponentType<any>) => {
  const SubList: ComponentType<SubListProps> = flow(
    asBodilessList('sublist', undefined, useOverrides),
    withDesign({
      // Below we pass the children as a title prop to the sublist. This
      // prop is forwarded to the Wrapper which renders it.  By making our
      // sublist wrapper accept a title prop, we enable replacing it with
      // some other component which expects one (eg <SubMenu /> from rc-menu).
      Wrapper: withSubListTitle,
    }),
  )('ul');
  // const transformDesign = (design: Design<any> = {}) => (
  //   omit(design, 'WrapperItem', 'SublistTitle', 'List')
  // );
  const AsSubList: FC<ListProps> = (props) => {
    const { design, children, ...rest } = props;
    // We need to capture the current node before passing the children as title.
    // Otherwise they are rendered in the context of the sublist node.
    const { node } = useNode();
    const title = <NodeProvider node={node}>{children}</NodeProvider>;
    return (
      <Item {...rest}>
        {/* We pass the title prop to the sublist */}
        <SubList design={design} title={title} />
      </Item>
    );
  };
  // return extendDesignable(transformDesign)(startComponents, 'SubList')(AsSubList);
  return AsSubList;
};

const withSimpleSubListDesign = (depth: number) => (withDesign$: HOC): HOC => (
  depth === 0 ? identity
    : withDesign({
      Item: flow(
        withDesign$,
        withSimpleSubListDesign(depth - 1)(withDesign$),
      ),
    }) as HOC
);

export default asBodilessList;
export { asSubList, withSimpleSubListDesign };
