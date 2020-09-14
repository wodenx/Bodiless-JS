import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { asEditable } from '@bodiless/components';

import {
  useNode, DefaultContentNode, NodeProvider, PageContextProvider, asReadOnly,
} from '@bodiless/core';
import { flow } from 'lodash';
import { addClasses, withDesign, addProps } from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  withSimpleMenuDesign,
  asMenuLink,
} from '../src/components/Menu';

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
    withDesign({
      Item: addProps({ 'data-bl-id': 'top-level-item' }),
    }),
    asReadOnly,
  )('ul');

  it('Saves sublist toggle to the correct nodeKey', () => {
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

  it('Passes the unwrap prop to a sublist', () => {
    const data = {
      'root$default$toggle-sublist': { on: true },
    };
    const wrapper = mount((
      <MockNodeProvider data={data}>
        <SimpleMenuList />
      </MockNodeProvider>
    ));
    const list = wrapper.findWhere(
      n => n.name() === 'List' && n.prop('data-bl-id') === 'top-level-item',
    );
    const unwrap = list.prop('unwrap');
    mockSetNode.mockClear();
    unwrap();
    expect(mockSetNode).toBeCalledWith(['root', 'default', 'toggle-sublist'], { on: false });
  });
});
