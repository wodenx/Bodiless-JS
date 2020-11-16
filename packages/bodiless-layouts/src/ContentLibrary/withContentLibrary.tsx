// @TODO: Use component selector
// @TODO: Allow filtering of content
// @TODO: Add overrides
// @TODO: Abstract button-with-group
// @TODO: Test compound nodes
import {
  useNode,
  ContentNode, useContextMenuForm,
  TMenuOption, withMenuOptions, NodeProvider, EditButtonOptions,
} from '@bodiless/core';
import React, { ComponentType, FC, useRef } from 'react';
import ComponentSelector from '../ComponentSelector';
import type { ComponentSelectorProps, Meta, ComponentWithMeta } from '../ComponentSelector/types';

export type ContentLibraryOptions = {
  useLibraryNode: (props: any) => { node: ContentNode<any> },
  DisplayComponent?: ComponentType<any>,
  Selector?: ComponentType<ComponentSelectorProps>,
  useMeta?: (node: ContentNode<any>) => Partial<Meta>|null,
  useOverrides?: (props: any) => Partial<EditButtonOptions<any, any>>,
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
    useLibraryNode,
    useMeta,
  } = options;

  const useMenuOptions = (props: any) => {
    const { node: targetNode } = useNode();
    const { node: libraryNode } = useLibraryNode(props);
    const keys = childKeys(libraryNode);

    // We save the components in a ref so as not to re-mount them on every render.
    const componentsRef = useRef<ComponentWithMeta[]>([]);
    if (componentsRef.current.length === 0) {
      componentsRef.current = keys.map(key => {
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
    }

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
          components={componentsRef.current}
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
  return withMenuOptions({ useMenuOptions, name: 'Content Library' });
};

export default withContentLibrary;
