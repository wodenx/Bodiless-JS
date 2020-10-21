import React from 'react';
import { shallow, mount } from 'enzyme';
import type { HTMLProps } from 'react';
import withTokensFromProps from '../src/withTokensFromProps';
import type { ComponentOrTag } from '../src/withTokensFromProps';

describe('withTokensFromProps', () => {
  const createTestToken = (attr: string) => (
    <P extends object>(C: ComponentOrTag<P>) => {
      const attrProp = { [attr]: true };
      const WithTestToken = (props: P) => <C {...props} {...attrProp} />;
      return WithTestToken;
    }
  );

  it('Applies tokens provided as props', () => {
    const token1 = createTestToken('data-token1');
    const token2 = createTestToken('data-token2');
    const Test = withTokensFromProps<HTMLProps<HTMLSpanElement>>('span');
    const wrapper = mount(<Test tokens={[token1, token2]} id="test" />);
    console.log(wrapper.debug());
    expect(wrapper.find('span#test').prop('data-token1')).toBeDefined();
    expect(wrapper.find('span#test').prop('data-token2')).toBeDefined();
  });

  it('Does not re-render tokens when they change', () => {
    const token1 = createTestToken('data-token1');
    const token2 = createTestToken('data-token2');
    const Test = withTokensFromProps<HTMLProps<HTMLSpanElement>>('span');
    const wrapper = mount(<Test tokens={[token1]} id="test" />);
    expect(wrapper.find('span#test').prop('data-token1')).toBeDefined();
    wrapper.setProps({ tokens: [token2] });
    wrapper.update();
    expect(wrapper.find('span#test').prop('data-token1')).toBeDefined();
    expect(wrapper.find('span#test').prop('data-token2')).toBeUndefined();
  });

  it.only('Re-renders other props when they change', () => {
    const token1 = createTestToken('data-token1');
    const Test = withTokensFromProps<HTMLProps<HTMLSpanElement>>('span');
    const wrapper = mount(<Test tokens={[token1]} id="test" className="foo" />);
    const span = wrapper.find('span#test');
    expect(span.prop('data-token1')).toBeDefined();
    expect(span.prop('className')).toBe('foo');
    wrapper.setProps({ className: 'bar' });
    expect(wrapper.find('span#test').prop('className')).toBe('bar');
  });
});
