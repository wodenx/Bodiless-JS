// @TODO: Use component selector
// @TODO: Allow filtering of content
// @TODO: Add overrides
// @TODO: Abstract button-with-group
// @TODO: Test compound nodes
import {
  useNode,
  ContentNode, useMenuOptionUI, useContextMenuForm,
  TMenuOption, withMenuOptions, NodeProvider,
} from '@bodiless/core';
import React, { ComponentType, FC } from 'react';
import { withoutProps } from '@bodiless/fclasses';
import { flow } from 'lodash';

type ComponentLibraryData = {
  nodeKey: string,
};

export type ContentLibrarySelectorProps = {
  components: {
    [key: string]: ComponentType,
  },
};

export type ContentLibraryOptions = {
  DisplayComponent?: ComponentType<any>,
  Selector?: ComponentType<ContentLibrarySelectorProps>,
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

const DefaultSelector: FC<ContentLibrarySelectorProps> = ({ components }) => {
  const {
    ComponentFormLabel,
    ComponentFormRadio,
    ComponentFormRadioGroup,
  } = useMenuOptionUI();
  const radios = Object.keys(components).map(key => {
    const ComponentWithNode = components[key];
    return (
      <ComponentFormLabel key={key}>
        <ComponentFormRadio value={key} name={key} />
        <ComponentWithNode />
      </ComponentFormLabel>
    );
  });
  return (
    <ComponentFormRadioGroup field="nodeKey">
      {radios}
    </ComponentFormRadioGroup>
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
    Selector = DefaultSelector,
    DisplayComponent = DefaultDisplayComponent,
  } = options;
  const useMenuOptions = (props: ContentLibraryProps) => {
    const { node: targetNode } = useNode();
    const { useLibraryNode } = props;
    const { node: libraryNode } = useLibraryNode(props);
    const keys = childKeys(libraryNode);
    const components: { [key: string]: FC } = keys.reduce((acc, key) => {
      const ComponentWithNode: FC = () => (
        <NodeProvider node={libraryNode.child(key)}>
          <DisplayComponent />
        </NodeProvider>
      );
      return { ...acc, [key]: ComponentWithNode };
    }, {});

    const renderForm = () => (
      <Selector components={components} />
    );
    const submitValues = ({ nodeKey }: ComponentLibraryData) => {
      if (nodeKey && components[nodeKey]) {
        copyNode(libraryNode.child(nodeKey), targetNode, true);
      }
    };
    const form = useContextMenuForm({ renderForm, submitValues });
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
