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
import {
  withMenuOptions, useEditContext, withLocalContextMenu, withContextActivator,
  withoutProps, ifEditable,
} from '@bodiless/core';
import type { ItemProps } from './types';

const useGetMenuOptions = (props: ItemProps) => {
  const {
    onAdd, onDelete, canDelete,
  } = props;
  const context = useEditContext();

  const asHandler = (action: Function) => () => {
    action();
    context.refresh();
  };

  return () => {
    const options = [];
    options.push({
      name: 'Add',
      icon: 'add',
      label: 'Add',
      handler: asHandler(onAdd),
      global: false,
      local: true,
    });
    // TODO: Disable rather than hide this button when delete is not allowed.
    if (canDelete()) {
      options.push({
        name: 'Remove',
        icon: 'delete',
        label: 'Delete',
        handler: asHandler(onDelete),
        global: false,
        local: true,
      });
    }
    return options;
  };
};

const asBodilessListItem = ifEditable(
  withMenuOptions({ useGetMenuOptions, name: 'list-item' }),
  withoutProps(['onAdd', 'onDelete', 'canDelete']),
  withLocalContextMenu,
  withContextActivator('onClick'),
);

export default asBodilessListItem;
