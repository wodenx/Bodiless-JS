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
import React, {
  ComponentType,
} from 'react';
import {
  ListProps,
  withToggleTo,
} from '@bodiless/components';
import { WithNodeProps } from '@bodiless/core';

type Props = Omit<ListProps, keyof WithNodeProps>;

/**
 * Takes a sublist component and returns a HOC which, when applied to a list item,
 * adds a toggled version of the sublist to the list item.
 *
 * @param Sublist The sublist component to add to the list item.
 */
const asBurgerMenuSublist = (Sublist: ComponentType<Props>) => (
  (Item: ComponentType<any>) => {
    const ItemWithSublist: ComponentType<ListProps> = ({ unwrap, nodeKey, ...rest }) => (
      <Sublist {...rest} />
    );
    const ItemWithoutSublist: ComponentType<any> = ({ wrap, nodeKey, ...rest }) => (
      <Item {...rest} />
    );
    return withToggleTo(ItemWithoutSublist)(ItemWithSublist);
  }
);

export default asBurgerMenuSublist;
