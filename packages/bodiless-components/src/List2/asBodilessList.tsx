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

import React, {
  Fragment,
  ComponentType,
  FC,
  PropsWithChildren,
} from 'react';
import { flowRight } from 'lodash';
import { observer } from 'mobx-react-lite';
import {
  withNode, withoutProps, WithNodeKeyProps, withNodeKey, WithNodeProps,
} from '@bodiless/core';
import { designable, withDesign } from '@bodiless/fclasses';
import { useItemsMutators, useItemsAccessors } from '../List/model';

import type { ItemProps } from './types';
import asBodilessListItem from './asBodilessListItem';

const NodeProvider = withNode<PropsWithChildren<{}>, any>(Fragment);

type CT<P> = ComponentType<P>|string;

type ItemWithNodeProps = {
  nodeKey: string,
  component: CT<ItemProps>,
} & ItemProps;

type Components = {
  Item: ComponentType<ItemProps>,
};

type Props = {
  /**
   * Method to invoke when the last item in the list is deleted
   * (usually signifying that the list itself should be deleted)
   */
  unwrap?: Function,
  /**
   * Method to invoke whenever an item in the list is deleted.
   */
  onDelete?: Function,
  components: Components,
};

const ItemWithNode: FC<ItemWithNodeProps> = ({ nodeKey, component: Component, ...rest }) => (
  <NodeProvider nodeKey={nodeKey}>
    <Component {...rest} />
  </NodeProvider>
);

const startComponents: Components = {
  Item: withoutProps(['onAdd', 'onDelete', 'canDelete'])('li'),
};

const asBodilessList$ = <P extends object>(ListComponent: CT<P>) => {
  const AsBodilessList = (props: P & Props) => {
    const {
      unwrap, onDelete, components, ...rest
    } = props;
    const { Item } = components;
    const { addItem, deleteItem } = useItemsMutators({ unwrap, onDelete });
    const { getItems } = useItemsAccessors();
    const itemData = getItems();
    const canDelete = () => Boolean(getItems().length > 1 || unwrap);
    const items = itemData.map(item => (
      <ItemWithNode
        component={Item}
        key={item}
        nodeKey={item}
        onAdd={() => addItem(item)}
        onDelete={() => deleteItem(item)}
        canDelete={canDelete}
      />
    ));
    return (
      <ListComponent {...rest as P}>
        {items}
      </ListComponent>
    );
  };
  return AsBodilessList;
};

type AsBodilessList<P> = (C: ComponentType<P>) => ComponentType<P & WithNodeProps>;

const asBodilessList = <P extends object>(nodeKey?: WithNodeKeyProps) => flowRight(
  withNodeKey(nodeKey),
  withNode,
  withDesign({
    Item: asBodilessListItem,
  }),
  designable<Components>(startComponents),
  observer,
  asBodilessList$,
) as AsBodilessList<P>;

export default asBodilessList;
