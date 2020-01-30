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

import React, { useRef, FC, PropsWithChildren } from 'react';
import { arrayMove, SortEnd } from 'react-sortable-hoc';
import { observer } from 'mobx-react-lite';
import { v1 } from 'uuid';
import {
  ContextProvider, useContextActivator, withActivateOnEffect, withNode, contextMenuForm,
} from '@bodiless/core';
import { DesignableComponents } from '@bodiless/fclasses';
import SortableChild from './SortableChild';
import SortableContainer from './SortableContainer';
import {
  useItemHandlers,
  useFlexboxDataHandlers,
  useGetMenuOptions,
} from './helpers';
import { EditFlexboxProps, FlexboxItem } from './types';
import ComponentSelector from '../ComponentSelector';
import { ComponentSelectorUI } from '../ComponentSelector/types';

const ChildNodeProvider = withNode<PropsWithChildren<{}>, any>(React.Fragment);

function isAllowedComponent(
  components: DesignableComponents,
  type: string,
): boolean {
  return Boolean(components[type]);
}

const FlexboxActivator: React.FC = ({ children }) => (
  <div {...useContextActivator('onClick')}>
    {children}
  </div>
);

const useOnSwap = (props: EditFlexboxProps, item: FlexboxItem) => {
  const { updateFlexboxItem } = useFlexboxDataHandlers();
  return () => contextMenuForm({
    initialValues: { selection: '' },
    hasSubmit: false,
  })(
    ({ ui, closeForm }) => (
      <ComponentSelector
        {...props}
        ui={{ ...ui as ComponentSelectorUI, ...props.ui as ComponentSelectorUI }}
        closeForm={closeForm}
        onSelect={(event, componentName) => {
          const newItem: FlexboxItem = { ...item, type: componentName };
          updateFlexboxItem(newItem);
          closeForm();
        }}
        components={Object.values(props.components)}
      />
    ),
  );
};


const EditFlexbox: FC<EditFlexboxProps> = (props:EditFlexboxProps) => {
  const uuid = useRef(v1());
  const { components, ui, snapData } = props;
  const items = useItemHandlers().getItems();
  const getMenuOptions = useGetMenuOptions(props);
  const {
    onFlexboxItemResize,
    setFlexboxItems,
    deleteFlexboxItem,
  } = useFlexboxDataHandlers();

  return (
    <ContextProvider
      name={`flex-${uuid.current}`}
      getMenuOptions={getMenuOptions}
    >
      <FlexboxActivator>
        <SortableContainer
          onSortEnd={(sort: SortEnd) => {
            const { oldIndex, newIndex } = sort;
            setFlexboxItems(arrayMove(items, oldIndex, newIndex));
          }}
        >
          {items.map(
            (flexboxItem: FlexboxItem, index: number): React.ReactNode => {
              if (!isAllowedComponent(components, flexboxItem.type)) {
                return null;
              }
              const ChildComponent = components[flexboxItem.type];
              return (
                <SortableChild
                  ui={ui}
                  key={`node-${flexboxItem.uuid}`}
                  index={index}
                  flexboxItem={flexboxItem}
                  snapData={snapData}
                  onDelete={() => deleteFlexboxItem(flexboxItem.uuid)}
                  onSwap={useOnSwap(props, flexboxItem)}
                  onResizeStop={
                    flexboxItemProps => onFlexboxItemResize(flexboxItem.uuid, flexboxItemProps)
                  }
                >
                  <ChildNodeProvider nodeKey={flexboxItem.uuid}>
                    <ChildComponent />
                  </ChildNodeProvider>
                </SortableChild>
              );
            },
          )}
        </SortableContainer>
      </FlexboxActivator>
    </ContextProvider>
  );
};

EditFlexbox.displayName = 'EditFlexbox';

EditFlexbox.defaultProps = {
  components: {},
};

// Wrap the EditFlexbox in a wthActivateContext so we can activate new items
export default withActivateOnEffect(observer(EditFlexbox));
