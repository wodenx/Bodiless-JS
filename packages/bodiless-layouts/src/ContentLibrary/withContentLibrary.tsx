import {
  useNode,
  ContentNode, useContextMenuForm,
  TMenuOption, withMenuOptions, NodeProvider,
} from '@bodiless/core';
import React, { ComponentType, FC } from 'react';
import { withoutProps } from '@bodiless/fclasses';
import { flow } from 'lodash';
import ComponentSelector from '../ComponentSelector';
import type { ComponentSelectorProps, Meta, ComponentWithMeta } from '../ComponentSelector/types';

export type ContentLibraryOptions = {
  DisplayComponent?: ComponentType<any>,
  Selector?: ComponentType<ComponentSelectorProps>,
  useMeta?: (node: ContentNode<any>) => Partial<Meta>,
};

export type ContentLibraryProps = {
  useLibraryNode: (props: any) => { node: ContentNode<any> },
};

const DefaultDisplayComponent: FC = () => {
  const { node } = useNode();
  return (
    <>
      {node.path.join('$')}
    </>
  );
};

const childKeys = (node: ContentNode<any>) => {
  const aParent = node.path;
  const aCandidates = node.keys.map(key => key.split('$'));
  return Object.keys(aCandidates.reduce(
    (acc, next) => {
      if (next.length <= aParent.length) return acc;
      for (let i = 0; i < aParent.length; i += 1) {
        if (aParent[i] !== next[i]) return acc;
      }
      return { ...acc, [next[aParent.length]]: true };
    },
    {},
  ));
};

const copyNode = (source: ContentNode<any>, dest: ContentNode<any>, copyChildren: boolean) => {
  dest.setData(source.data);
  if (copyChildren) {
    childKeys(source).forEach(key => copyNode(source.child(key), dest.child(key), true));
  }
};

const withContentLibrary = (options: ContentLibraryOptions) => {
  const {
    DisplayComponent = DefaultDisplayComponent,
    Selector = ComponentSelector,
  } = options;

  const useMenuOptions = (props: ContentLibraryProps) => {
    const { node: targetNode } = useNode();
    const { useLibraryNode } = props;
    const { node: libraryNode } = useLibraryNode(props);
    const keys = childKeys(libraryNode);

    const components: ComponentWithMeta[] = keys.map(key => {
      const node = libraryNode.child(key);
      const ComponentWithNode: ComponentWithMeta = () => (
        <NodeProvider node={node}>
          <DisplayComponent />
        </NodeProvider>
      );
      ComponentWithNode.displayName = key;
      ComponentWithNode.title = key;
      ComponentWithNode.description = key;

      if (options.useMeta) {
        const meta = options.useMeta(node);
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
    const menuOptions: TMenuOption[] = [
      {
        name: 'content-library',
        group: 'content-library-group',
        label: 'Content',
        icon: 'account_balance',
        local: true,
        global: false,
        handler: () => form,
      },
      {
        name: 'content-library-group',
        label: 'Library',
        groupMerge: 'merge',
        global: false,
        local: true,
        Component: 'group',
      },
    ];
    return menuOptions;
  };
  return flow(
    withoutProps('useLibraryNode'),
    withMenuOptions<ContentLibraryProps>({ useMenuOptions, name: 'Content Library' }),
  );
};

export default withContentLibrary;
