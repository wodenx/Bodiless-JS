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

import { useCallback } from 'react';
import { omit } from 'lodash';
import {
  useEditContext, useActivateOnEffect, useGetter,
} from '@bodiless/core';
import { EditFlowContainerProps, FlowContainerItem } from './types';
import { useFlowContainerDataHandlers, useItemHandlers } from './model';
import { ComponentSelectorProps } from '../ComponentSelector/types';
import componentSelectorForm from '../ComponentSelector/componentSelectorForm';

/**
 * @private
 *
 * Removes components from the design which are part of the actual flow container design,
 * not intended to appear as options in the component selector.
 *
 * @param props The original props of the flow container.
 *
 * @return The props with irrelevant components removed.
 */
const withNoDesign = (props:EditFlowContainerProps):EditFlowContainerProps => ({
  ...props,
  components: omit(props.components, ['Wrapper', 'ComponentWrapper']),
});

/**
 * @private
 *
 * Returns actions which can be executed upon selecting a component in the
 * component selector.
 *
 * @param props The props provided to the FlowContainer
 * @param currentItem The currently selected item in the grid (optional);
 */
const useComponentSelectorActions = (
  currentItem?: FlowContainerItem,
) => {
  const { insertFlowContainerItem, updateFlowContainerItem } = useFlowContainerDataHandlers();
  const { setId } = useActivateOnEffect();

  const insertItem: ComponentSelectorProps['onSelect'] = (event, componentName) => {
    const { uuid } = insertFlowContainerItem(componentName, currentItem);
    // Set the new id so it will activate on creation.
    setId(uuid);
  };

  const replaceItem: ComponentSelectorProps['onSelect'] = (event, componentName) => {
    if (currentItem) {
      const newItem: FlowContainerItem = { ...currentItem, type: componentName };
      updateFlowContainerItem(newItem);
    }
  };

  return { insertItem, replaceItem };
};

function useDeleteButton(props: EditFlowContainerProps, item: FlowContainerItem) {
  const context = useEditContext();
  const { deleteFlowContainerItem } = useFlowContainerDataHandlers();
  const { setId } = useActivateOnEffect();

  const handler = () => {
    const newContextItem = deleteFlowContainerItem(item.uuid);
    // Set the context to the next item in the flow container (if it exists)
    // or to the flow container itself (if not).
    if (newContextItem !== undefined) setId(newContextItem.uuid);
    else context.activate();
  };

  return {
    name: 'delete',
    label: 'Delete',
    icon: 'delete',
    handler,
    isHidden: useCallback(() => !context.isEdit, []),
  };
}

function useAddButton(props: EditFlowContainerProps, item?: FlowContainerItem) {
  const { maxComponents = Infinity } = props;
  const context = useEditContext();
  const { insertItem } = useComponentSelectorActions(item);
  const { getItems } = useItemHandlers();
  const isHidden = item
    ? useCallback(() => !context.isEdit || getItems().length >= maxComponents, [maxComponents])
    : useCallback(() => !context.isEdit || getItems().length > 0, []);
  return {
    icon: 'add',
    label: 'Add',
    name: 'add',
    handler: () => componentSelectorForm(props, insertItem),
    isHidden,
  };
}

function useSwapButton(props: EditFlowContainerProps, item: FlowContainerItem) {
  const context = useEditContext();
  const { replaceItem } = useComponentSelectorActions(item);
  return {
    name: 'swap',
    label: 'Swap',
    icon: 'repeat',
    handler: () => componentSelectorForm(props, replaceItem),
    isHidden: useCallback(() => !context.isEdit, []),
  };
}

function useMenuOptions(props: EditFlowContainerProps) {
  const addButton = useAddButton(withNoDesign(props));
  return [addButton];
}

/**
 * @private
 *
 * Returns a 'useGetMenuOptions' hook which is passed to each flow container item. When invoked,
 * this hook returns a memoized 'getMenuOptions' callback, suitable for passing to
 * PageContextProvider.
 *
 * The reasons for this extra indirection (a hook returning a hook) are:
 * - we want to build the menu options using the node of the flow container
 * - We want the options added using the context of the item
 * - The memoization of the options has to happen in the context of the item to avoid changing the
 *   order of hooks in the container as items are added and removed.
 * - The item must memoize the callback itself and use PageContextProvider directly
 *   rather than relying on `withMenuOptions`. This is because we don't want to call
 *   the `withMenuOptions` HOC in the context of a render.
 *
 * @param props Props passed to this component
 * @param item The flow container item for which to create the hook.
 *
 * @return A `useGetMenuOptinos` hook which will be passed to the item.
 */
function useItemUseGetMenuOptions(props: EditFlowContainerProps, item: FlowContainerItem) {
  const props$ = withNoDesign(props);
  const buttons = [
    useAddButton(props$, item),
    useSwapButton(props$, item),
    useDeleteButton(props$, item),
  ];

  return () => useGetter(buttons);
}

export { useMenuOptions, useItemUseGetMenuOptions };
