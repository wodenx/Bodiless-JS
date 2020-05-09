import React, { ComponentType } from 'react';
import { flowRight } from 'lodash';
import { mount } from 'enzyme';
import withNode, { withNodeKey } from '../src/withNode';
import { useNode } from '../src/NodeProvider';
import withSidecarNodes from '../src/withSidecarNodes';

type HOC = (C: ComponentType<any>) => ComponentType<any>;
type Bodiless = (key?: string) => HOC;

const withEnhancement = (id: string) => (Component: ComponentType<any>) => withNode(
  (props: any) => {
    const { node } = useNode();
    const enhancement = {
      [`data-enh-${id}`]: node.path.join('$'),
    };
    return (
      <Component {...props} {...enhancement} />
    );
  },
);

// const withId: (id: string) => HOC = id => Component => props => (
//   <Component {...props} id={id} />
// );

const NodePathPrinter = withNode(
  (props: any) => (<span {...props}>{useNode().node.path.join('$')}</span>),
);

const CompoundPrinter = withNode(
  ({ printer: Printer, ...rest }: any) => (
    <span {...rest}>
      <Printer nodeKey="baz" id="baz" />
    </span>
  ),
);

const withFoo: Bodiless = (nodeKey?: string) => flowRight(
  withNodeKey(nodeKey),
  withEnhancement('foo'),
);

const withBar: Bodiless = (nodeKey?: string) => flowRight(
  withNodeKey(nodeKey),
  withEnhancement('bar'),
);


describe('withSidecarNodes', () => {
  it('is tested against the correct baseline', () => {
    const asTestWithoutEnhancement: HOC = flowRight(
      withNodeKey('test'),
    );
    const Test = asTestWithoutEnhancement(NodePathPrinter);
    const wrapper = mount(<Test id="test" />);
    expect(wrapper.find('span#test').text()).toBe('root$test');
  });

  it('adds new children and restores original node', () => {
    const asTestWithEnhancement: HOC = flowRight(
      withNodeKey('test'),
      withSidecarNodes(
        withFoo('foo'),
        withBar('bar'),
      ),
    );
    const Test = asTestWithEnhancement(NodePathPrinter);
    const wrapper = mount(<Test id="test" />);
    const span = wrapper.find('span#test');
    expect(span.text()).toBe('root$test');
    expect(span.prop('data-enh-foo')).toBe('root$test$foo');
    expect(span.prop('data-enh-bar')).toBe('root$test$foo$bar');
  });


  it('can create multiple sidecars', () => {
    const asTest: HOC = flowRight(
      withNodeKey('test'),
      withSidecarNodes(
        withFoo('foo'),
      ),
      withSidecarNodes(
        withBar('bar'),
      ),
    );
    const Test = asTest(NodePathPrinter);
    const wrapper = mount(<Test id="test" />);
    const span = wrapper.find('span#test');
    expect(span.text()).toBe('root$test');
    expect(span.prop('data-enh-foo')).toBe('root$test$foo');
    expect(span.prop('data-enh-bar')).toBe('root$test$bar');
  });

  it('is tested against the correct baseline for nested sidecars', () => {
    const wrapper = mount(<CompoundPrinter
      printer={NodePathPrinter}
      id="test"
      nodeKey="test"
    />);
    const span = wrapper.find('span#baz');
    expect(span.text()).toBe('root$test$baz');
  });

  it('supports nested sidecars', () => {
    const EnhancedCompoundPrinter = withSidecarNodes(withFoo('foo'))(CompoundPrinter);
    const EnhancedPrinter = withSidecarNodes(withBar('bar'))(NodePathPrinter);
    const wrapper = mount(<EnhancedCompoundPrinter
      printer={EnhancedPrinter}
      id="test"
      nodeKey="test"
    />);
    const innerSpan = wrapper.find('span#baz');
    expect(innerSpan.text()).toBe('root$test$baz');
    expect(innerSpan.prop('data-enh-bar')).toBe('root$test$baz$bar');
    const outerSpan = wrapper.find('span#test');
    expect(outerSpan.prop('data-enh-foo')).toBe('root$test$foo');
  });

  it('adds new peers and restores original node', () => {
    const asTestWithEnhancement: HOC = flowRight(
      withSidecarNodes(
        withFoo('foo'),
        withBar('bar'),
      ),
      withNodeKey('test'),
    );
    const Test = asTestWithEnhancement(NodePathPrinter);
    const wrapper = mount(<Test id="test" />);
    const span = wrapper.find('span#test');
    expect(span.text()).toBe('root$test');
    expect(span.prop('data-enh-foo')).toBe('root$foo');
    expect(span.prop('data-enh-bar')).toBe('root$foo$bar');
  });
});
