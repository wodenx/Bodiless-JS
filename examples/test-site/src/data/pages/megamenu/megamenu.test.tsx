import React from 'react';
import { mount } from 'enzyme';
import { asEditable } from '@bodiless/components';

import {
  useNode, DefaultContentNode, NodeProvider, PageContextProvider, asReadOnly,
} from '@bodiless/core';
import { flow } from 'lodash';
import { addClasses } from '@bodiless/fclasses';
import {
  asMenuBase as asSimpleMenuBase,
  withMenuDesign as withSimpleMenuDesign,
} from './organisms/SimpleMenu';
import { asMenuLink } from './organisms/MegaMenuTitles';

const mockSetNode = jest.fn();

const MockNodeProvider = ({ data, children }: any) => {
  const { node } = useNode() as { node: DefaultContentNode<any> };
  const getters = node.getGetters();
  const actions = node.getActions();
  const { getNode: getNode$ } = getters;

  const getNode = jest.fn((path: string[]) => data[path.join('$')] || getNode$(path));

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

// const withActivate = (Component: any) => (props: any) => {
//   const context = useEditContext();
//   useEffect(() => context.activate());
//   return <Component {...props} />;
// };

const withTitleEditor = asEditable('text', 'Menu Item');

describe('SimpleMenu', () => {
  const SimpleMenuList = flow(
    asSimpleMenuBase(),
    withSimpleMenuDesign({
      Title: asMenuLink(withTitleEditor),
    }),
    withSimpleMenuDesign({
      Item: addClasses('pl-5'),
    }),
    asReadOnly,
  )('ul');

  it('wtf??', () => {
    const wrapper = mount((
      <MockNodeProvider data={{}}>
        <SimpleMenuList />
      </MockNodeProvider>
    ));
    const provider = wrapper.find(PageContextProvider);
    const getMenuOptions = provider.prop('getMenuOptions');
    const option = getMenuOptions!()[0];
    // @ts-ignore
    option.handler();
    expect(mockSetNode).toHaveBeenCalledTimes(1);
    expect(mockSetNode.mock.calls[0][0].join('$')).toBe('root$default$toggle-sublist');
  });
});
