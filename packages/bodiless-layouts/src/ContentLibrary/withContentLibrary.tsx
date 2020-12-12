import React, { ComponentType } from 'react';
import {
  useNode, ContentNode, useContextMenuForm,
  createMenuOptionGroup, withMenuOptions, NodeProvider,
} from '@bodiless/core';
import type { OptionGroupDefinition } from '@bodiless/core';
import { observer } from 'mobx-react-lite';
import { flow } from 'lodash';
import ComponentSelector from '../ComponentSelector';
import type { ComponentSelectorProps, Meta, ComponentWithMeta } from '../ComponentSelector/types';

export type ContentLibraryOptions = {
  useLibraryNode: (props: any) => { node: ContentNode<any> },
  DisplayComponent?: ComponentType<any>,
  Selector?: ComponentType<ComponentSelectorProps>,
  useMeta?: (node: ContentNode<any>) => Partial<Meta>|null,
  useOverrides?: (props: any) => Partial<OptionGroupDefinition>,
};

export const copyNode = (
  source: ContentNode<any>, dest: ContentNode<any>, copyChildren: boolean,
) => {
  dest.setData(source.data);
  if (copyChildren) {
    source.childKeys.forEach(key => copyNode(source.child(key), dest.child(key), true));
  }
};

const withContentLibrary = (options: ContentLibraryOptions) => (
  Component: ComponentType,
) => {
  const {
    DisplayComponent = Component,
    Selector = ComponentSelector,
    useLibraryNode,
    useMeta,
    useOverrides = () => {},
  } = options;

  const useMenuOptions = (props: any) => {
    const { node: targetNode } = useNode();
    const { node: libraryNode } = useLibraryNode(props);
    const keys = libraryNode.childKeys;

    const components = keys.map(key => {
      const node = libraryNode.child(key);
      const ComponentWithNode: ComponentWithMeta = () => (
        <NodeProvider node={node}>
          <DisplayComponent />
        </NodeProvider>
      );
      ComponentWithNode.displayName = key;
      ComponentWithNode.title = key;
      ComponentWithNode.description = key;

      if (useMeta) {
        const meta = useMeta(node);
        // If createMeta returns null or undefined, it means do not use this node.
        if (!meta) return null;
        Object.assign(ComponentWithNode, meta);
      }
      return ComponentWithNode;
    }).filter(Boolean) as ComponentWithMeta[];

    const renderForm = ({ closeForm }:any) => {
      const onSelect = ([name]: string[]) => {
        if (name) {
          copyNode(libraryNode.child(name), targetNode, true);
        }
        closeForm(null);
      };
      return (
        <Selector
          closeForm={closeForm}
          onSelect={onSelect}
          components={components}
        />
      );
    };
    const form = useContextMenuForm({ renderForm, hasSubmit: false });
    const baseOption: OptionGroupDefinition = {
      name: 'content-library',
      group: 'content-library-group',
      label: 'Library',
      groupLabel: 'Content',
      groupMerge: 'merge',
      icon: 'account_balance',
      local: true,
      global: false,
      formTitle: 'Content Library',
      formDescription: 'Select the content you wish to insert.',
      isHidden: !components.length,
    };
    const finalOption = {
      ...baseOption,
      ...useOverrides(props),
      handler: () => form,
    };
    return createMenuOptionGroup(finalOption);
  };
  return flow(
    withMenuOptions({ useMenuOptions, name: 'Content Library' }),
    observer,
  )(Component);
};

export default withContentLibrary;
