import React from 'react';
import { mount, ComponentType } from 'enzyme';
import {
  DefaultContentNode, NodeProvider, useNode, withNodeKey, withNode,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { withDesign } from '@bodiless/fclasses';

import asBodilessChamelion from '../src/asBodilessChamelion';

const mockSetNode = jest.fn();
// @ts-ignore Unused
let mockGetNode = jest.fn();

const MockNodeProvider = ({ data, children }: any) => {
  const { node } = useNode() as { node: DefaultContentNode<any> };
  const getters = node.getGetters();
  const actions = node.getActions();
  const { getNode: getNode$ } = getters;
  const getNode = jest.fn(
    (path: string[]) => {
      return data[path.join('$')] || getNode$(path)
    }
  );
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

const TestComponent = flowRight(withNodeKey('component'), withNode)(
  ({ dataKey, ...rest }: any) => {
    const { node } = useNode();
    // @ts-ignore No index signature for node.data
    return <span id="test" data-node-value={node.data[dataKey] || 'undefined'} {...rest} />;
  },
);
const withProps = (xprops: any) => (Component: ComponentType<any>|string) => (props: any) => (
  <Component {...props} {...xprops} />
);

describe('asBodilessChamelion', () => {
  it('Applies a design correctly depending on toggle state', () => {
    const design = {
      A: withProps({ 'data-test-A': true }),
      B: withProps({ 'data-test-B': true }),
    };
    const data = { root$chamelion: { component: 'A' } };
    const TestChamelion = flowRight(
      withDesign(design),
      asBodilessChamelion('chamelion'),
    )(TestComponent);
    const wrapper = mount((
      <MockNodeProvider data={data}>
        <TestChamelion />
      </MockNodeProvider>
    ));
    console.log(wrapper.debug());
    expect(mockGetNode.mock.calls[0][0]).toEqual(['root', 'chamelion']);
    expect(wrapper.find('span#test').prop('data-test-A')).toBe(true);
  });
});
