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

import { useMemo } from 'react';
import {
  withMenuOptions, withLocalContextMenu,
  withContextActivator, ifEditable, PageEditContextInterface, TMenuOption, useEditContext,
} from '@bodiless/core';
import { v1 } from 'uuid';

import { withFinalDesign } from '@bodiless/fclasses';
import { flow } from 'lodash';
import { ItemProps, UseListOverrides } from './types';

const hasChildSubList = (context: PageEditContextInterface, count: number = 1): boolean => {
  const descendants = context.activeDescendants || [];
  // The first child list is the one to which this toggle applies,
  // so we check to see if more than one.
  return descendants.filter(c => c.type === 'list-item').length > count;
};

const useMenuOptions = (useOverrides: UseListOverrides = () => ({})) => (props: ItemProps) => {
  // const context = useEditContext();
  const {
    addItem, deleteItem, canDelete,
  } = props;

  // Search for parent lists to set the default group label
  const context = useEditContext();
  let n = 0;
  for (let c:PageEditContextInterface|undefined = context; c; c = c.parent) {
    if (c.type === 'list-item') n += 1;
  }
  const sublistLabel = n > 1 ? `Sublist ${n} Item` : 'Sublist Item';
  const defaultGroupLabel = n > 0 ? sublistLabel : 'List Item';

  const { groupLabel = defaultGroupLabel, global = false, local = true } = useOverrides(props);
  const id = v1();
  const group = `list-item-group-${id}`;

  const menuOptions:TMenuOption[] = useMemo(() => ([
    {
      name: `add-${id}`,
      // isHidden: () => hasChildSubList(context),
      icon: 'add',
      label: 'Add',
      handler: addItem,
      global,
      local,
      group,
    },
    {
      name: `remove-${id}`,
      icon: 'delete',
      label: 'Delete',
      // isHidden: () => !canDelete() || hasChildSubList(context),
      isHidden: () => !canDelete(),
      handler: deleteItem,
      global,
      local,
      group,
    },
    {
      name: group,
      label: groupLabel,
      global,
      local,
      Component: 'group',
    },
  ]), []);

  return menuOptions;
};

/**
 * HOC which adds list edit buttons (Add and Delete Item).
 */
const withListButtons = (useOverrides?: UseListOverrides) => ifEditable(
  withFinalDesign({
    Item: withMenuOptions({
      useMenuOptions: useMenuOptions(useOverrides),
      name: 'List Item',
      type: 'list-item',
    }),
    // @TODO: These are here bc of rc-menu.  If possible, they should go on the item,
    // not the title, but rc-menu items don't accept click events, and can't be
    // wrapped without breaking things.
    Title: flow(
      withContextActivator('onClick'),
      withLocalContextMenu,
      // @TODO: Fix this: We need to add an empty context here so that we don't end up with 2 local
      // menus associated with the same context when using the chameleon button.
      withMenuOptions({ useMenuOptions: () => [], name: 'List Item Title ' }),
    ),
  }),
);

export default withListButtons;
export { hasChildSubList };
