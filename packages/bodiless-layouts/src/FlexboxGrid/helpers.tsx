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

import * as React from 'react';
import { v1 } from 'uuid';
import {
  contextMenuForm,
  useEditContext, useNode,
  useActivateOnEffect,
} from '@bodiless/core';
import ComponentSelector from '../ComponentSelector';
import { ComponentSelectorUI, ComponentSelectorProps } from '../ComponentSelector/types';
import {
  EditFlexboxProps, FlexboxItem, FlexboxItemProps, FlexboxData,
} from './types';

type InsertContentNode = (componentName: string, uuid?: string) => FlexboxItem;
type SetFlexboxItems = (items: FlexboxItem[]) => void;
type UpdateFlexboxItem = (flexboxItem: FlexboxItem) => void;
type OnFlexboxItemResize = (
  uuid: string,
  props: FlexboxItemProps,
) => void;
type DeleteFlexboxItem = (uuid: string) => void;
export interface FlexboxDataHandlers {
  insertFlexboxItem: InsertContentNode;
  setFlexboxItems: SetFlexboxItems;
  updateFlexboxItem: UpdateFlexboxItem;
  onFlexboxItemResize: OnFlexboxItemResize;
  deleteFlexboxItem: DeleteFlexboxItem;
}

export function useItemHandlers() {
  const { node } = useNode<FlexboxData>();
  const getItems = () => {
    const { items } = node.data;
    return items || [];
  };
  const setItems = (items: FlexboxItem[]) => {
    node.setData({ items });
  };
  return { getItems, setItems };
}

function useFlexboxDataHandlers(): FlexboxDataHandlers {
  const { getItems, setItems } = useItemHandlers();
  return {
    insertFlexboxItem: (componentName: string, uuid: string|undefined) => {
      const items = getItems();
      const newItem = {
        uuid: uuid || v1(),
        wrapperProps: {},
        type: componentName,
      };
      setItems(items.concat(newItem));
      return newItem;
    },
    setFlexboxItems: setItems,
    updateFlexboxItem: (flexboxItem: FlexboxItem) => {
      const items = getItems();
      const itemIndex = items.findIndex(
        (item: FlexboxItem) => flexboxItem.uuid === item.uuid,
      );
      if (itemIndex !== -1) {
        const newItems = [...items];
        newItems.splice(itemIndex, 1, flexboxItem);
        setItems(newItems);
      }
    },
    onFlexboxItemResize: (contentUuid, itemProps) => {
      const items = getItems();
      const itemIndex = items.findIndex(
        (item: FlexboxItem) => contentUuid === item.uuid,
      );
      if (itemIndex !== -1) {
        const currentFlexboxItem = items[itemIndex];
        const updatedFlexboxItem: FlexboxItem = {
          ...currentFlexboxItem,
          wrapperProps: {
            ...(currentFlexboxItem.wrapperProps || {}),
            ...itemProps,
          },
        };
        items.splice(itemIndex, 1, updatedFlexboxItem);
        setItems(items);
      }
    },
    deleteFlexboxItem: (uuid: string) => {
      const items = getItems();
      const itemIndex = items.findIndex(
        (flexboxItem: FlexboxItem) => uuid === flexboxItem.uuid,
      );
      if (itemIndex !== -1) {
        const newItems = [...items];
        newItems.splice(itemIndex, 1);
        setItems(newItems);
      }
    },
  };
}

/**
 * Returns a component selector form.
 *
 * @param props The props passed to the EditFlexbox
 * @param onSelect The action to perform when a component is selected.
 */
const useComponentSelectorForm = (
  props: EditFlexboxProps,
  onSelect: ComponentSelectorProps['onSelect'],
) => contextMenuForm({
  initialValues: { selection: '' },
  hasSubmit: false,
})(
  ({ ui, closeForm }) => (
    <ComponentSelector
      {...props}
      ui={{ ...ui as ComponentSelectorUI, ...props.ui as ComponentSelectorUI }}
      closeForm={closeForm}
      onSelect={(...args) => { onSelect(...args); closeForm(); }}
      components={Object.values(props.components)}
    />
  ),
);

/**
 * Returns actions which can be executed upon selecting a component in the
 * component selector.
 *
 * @param props The props provided to the FlexboxGrid
 * @param currentItem The currently selected item in the grid (optional);
 */
export const useComponentSelectorActions = (
  props: EditFlexboxProps,
  currentItem?: FlexboxItem,
) => {
  const { insertFlexboxItem, updateFlexboxItem } = useFlexboxDataHandlers();
  const { setId } = useActivateOnEffect();

  const insertItem: ComponentSelectorProps['onSelect'] = (event, componentName) => {
    const { uuid } = insertFlexboxItem(componentName);
    // Set the new id so it will activate on creation.
    setId(uuid);
  };

  const replaceItem: ComponentSelectorProps['onSelect'] = (event, componentName) => {
    if (currentItem) {
      const newItem: FlexboxItem = { ...currentItem, type: componentName };
      updateFlexboxItem(newItem);
    }
  };

  return { insertItem, replaceItem };
};

function useGetMenuOptions(props: EditFlexboxProps, item?: FlexboxItem) {
  const context = useEditContext();
  // const id = React.useRef(v1()).current;
  // useActivateOnEffectActivator('xyzabc');
  const { setId } = useActivateOnEffect();
  const { maxComponents } = props;
  const { getItems } = useItemHandlers();
  const { deleteFlexboxItem } = useFlexboxDataHandlers();
  const { insertItem, replaceItem } = useComponentSelectorActions(props, item);
  const addButton = {
    icon: 'add',
    name: 'add',
    handler: () => useComponentSelectorForm(props, insertItem),
  };
  const deleteButton = !item ? undefined : {
    name: 'delete',
    icon: 'delete',
    handler: () => {
      deleteFlexboxItem(item.uuid);
      // Activate the current context after the delete (this context is the flexbox)
      const items = getItems();
      if (items.length) setId(items[0].uuid);
      else context.activate();
    },
  };
  const swapButton = !item ? undefined : {
    name: 'swap',
    icon: 'flip_camera_ios',
    handler: () => useComponentSelectorForm(props, replaceItem),
  };


  const getFlexboxButtons = (nItems: Number) => (
    // The flexbox itself only has an add button when empty (otherwise an add button.
    // will be attached to each item).
    nItems ? [] : [addButton]
  );
  const getItemButtons = (nItems: Number) => (
    // An item only has an add button if we have not hit the maximum allowed items.
    maxComponents && nItems >= maxComponents
      ? [swapButton!, deleteButton!]
      : [addButton, swapButton!, deleteButton!]
  );

  return () => {
    if (!context.isEdit) return [];
    const nItems = getItems().length;
    return item ? getItemButtons(nItems) : getFlexboxButtons(nItems);
  };
}
export { useGetMenuOptions, useFlexboxDataHandlers };
