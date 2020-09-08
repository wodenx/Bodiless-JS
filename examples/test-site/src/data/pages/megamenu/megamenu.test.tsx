import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import { asEditable } from '@bodiless/components';

import { useNode, DefaultContentNode, NodeProvider, useEditContext } from '@bodiless/core';
import { flow } from 'lodash';
import {
  asMenuBase as asSimpleMenuBase,
  withMenuDesign as withSimpleMenuDesign,
} from './organisms/SimpleMenu';
import { asMenuLink } from './organisms/MegaMenuTitles';

const mockSetNode = jest.fn();
let mockGetNode: any;

const MockNodeProvider = ({ data, children }: any) => {
  const { node } = useNode() as { node: DefaultContentNode<any> };
  const getters = node.getGetters();
  const actions = node.getActions();
  const { getNode: getNode$ } = getters;

  const getNode = jest.fn((path: string[]) => {
    console.log(path);
    return data[path.join('$')] || getNode$(path);
  });
  mockGetNode = getNode;

  const newNode = new DefaultContentNode(
    { ...actions, setNode: mockSetNode },
    { ...getters, getNode },
    node.path,
  );
  return (
    <NodeProvider node={newNode}>
      {children}
    </NodeProvider>
  );
};

const withActivate = (Component: any) => (props: any) => {
  const context = useEditContext();
  useEffect(() => context.activate());
  return <Component {...props} />;
};

const withTitleEditor = asEditable('text', 'Menu Item');

describe('SimpleMenu', () => {
  const SimpleMenuList = flow(
    asSimpleMenuBase(),
    withSimpleMenuDesign({
      Title: flow(withActivate, asMenuLink(withTitleEditor)),
    }),
    // withSimpleMenuDesign({
    //   Item: addClasses('pl-5'),
    // }),
    // asReadOnly,
  )('ul');

  it('wtf??', () => {
    const wrapper = mount((
      <MockNodeProvider data={{}}>
        <SimpleMenuList />
      </MockNodeProvider>
    ));
    console.log(wrapper.debug());
  });
});
