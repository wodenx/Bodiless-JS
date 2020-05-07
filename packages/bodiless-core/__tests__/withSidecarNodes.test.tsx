import React, { ComponentType } from 'react';
import { flowRight } from 'lodash';
import { mount } from 'enzyme';
import withNode, { withNodeKey } from '../src/withNode';
import { useNode } from '../src/NodeProvider';

const withEnhancement = (id: string) => (Component: ComponentType<any>) => (props: any) => {
  const { node } = useNode();
  const enhancement = {
    [`data-enh-${id}`]: node.path.join('$'),
  };
  return (
    <Component {...props} {...enhancement} />
  );
};

const withSidecarNodes = flowRight;

const NodePathPrinter = (props: any) => (<span {...props}>{useNode().node.path.join('$')}</span>);

const asBodilessComponent = (nodeKey?: string) => flowRight(
  withNodeKey(nodeKey),
  withNode,
);

const withCompoundEnhancement = (nodeKey?: string) => flowRight(
  asBodilessComponent(nodeKey),
  withEnhancement('foo'),
  asBodilessComponent('bar'),
  withEnhancement('bar'),
);

const asTestWithoutEnhancement = flowRight(
  asBodilessComponent('test'),
);

const asTestWithEnhancement = flowRight(
  withNodeKey('test'),
  withSidecarNodes(
    withCompoundEnhancement('foo'),
  ),
  asBodilessComponent(),
);

describe('withSidecarNodes', () => {
  it('restores the original node', () => {
    let Test;
    let wrapper;
    Test = asTestWithoutEnhancement(NodePathPrinter);
    wrapper = mount(<Test id="test" />);
    expect(wrapper.find('span#test').text()).toBe('root$test');
    Test = asTestWithEnhancement(NodePathPrinter);
    wrapper = mount(<Test id="test" />);
    const span = wrapper.find('span#test');
    expect(span.text()).toBe('root$test');
    expect(span.prop('data-enh-foo')).toBe('root$test$foo');
    expect(span.prop('data-enh-bar')).toBe('root$test$foo$bar');
    console.log(wrapper.debug());
  });
});

export default withCompoundEnhancement;
