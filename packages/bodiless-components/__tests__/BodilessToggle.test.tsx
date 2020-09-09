import React from 'react';
import type { ComponentType } from 'react';
import { observable, action } from 'mobx';
import {
  useNode, DefaultContentNode, NodeProvider, withNodeKey, withNode, PageContextProvider,
} from '@bodiless/core';
import { mount, ReactWrapper } from 'enzyme';
import { flowRight } from 'lodash';
import { HOC } from '@bodiless/fclasses';
import asBodilessToggle, {
  ifBodilessTogggleOn, ifBodilessToggleOff, withBodilessToggleButton, useBodilessToggle,
} from '../src/asBodilessToggle';

const mockSetNode = jest.fn();

const MockNodeProvider = ({ data, children }: any) => {
  const { node } = useNode() as { node: DefaultContentNode<any> };
  const getters = node.getGetters();
  const actions = node.getActions();
  const { getNode: getNode$ } = getters;

  // const basePath = node.path.join('$');
  // const data = {
  //   [`${basePath}$${toggleNodeKey}`]: { on },
  //   [`${basePath}$${componentNodeKey}`]: { foo: 'bar' },
  // };
  const getNode = (path: string[]) => data[path.join('$')] || getNode$(path);
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
    return <span id="test" data-node-value={node.data[dataKey]} {...rest} />;
  },
);

describe('MockNodeProvider', () => {
  it('returns the correct data for the node key', () => {
    const Test = () => (
      <MockNodeProvider data={{ root$component: { bar: 'baz' } }}>
        <TestComponent dataKey="bar" />
      </MockNodeProvider>
    );
    const wrapper = mount(<Test />);
    const span = wrapper.find('span#test');
    expect(span.prop('data-node-value')).toBe('baz');
  });
});

describe('asBodilessToggle', () => {
  const addTestPropIfOn = asBodilessToggle((hook: any) => (Component: any) => (props: any) => (
    hook(props)
      ? <Component {...props} data-test-prop />
      : <Component {...props} />
  ));
  const ToggledTestComponent = addTestPropIfOn('toggle')(TestComponent);
  const Test = ({ data, ...rest }: any) => (
    <MockNodeProvider data={data}>
      <ToggledTestComponent {...rest} />
    </MockNodeProvider>
  );

  it('Preserves the node path of the wrapped component', () => {
    const data = {
      root$toggle: { on: true },
      root$component: { foo: 'bar' },
    };
    const wrapper = mount(<Test data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('Preserves the node path of the wrapped component when toggled off', () => {
    const data = {
      root$component: { foo: 'bar' },
    };
    const wrapper = mount(<Test data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  // This fails bc, even with sidecar nodes, the outermost component receives
  // the top level nodeKey. We could fix this for sidecar nodes by storing and
  // restoring the nodeKey...
  it.skip('Preserves the node path of the wrapped component when nodeKey specified as prop', () => {
    const data = {
      root$toggle: { on: true },
      root$bizzle: { foo: 'bar' },
      root$component: { foo: 'bing' },
    };
    const wrapper = mount(<Test data={data} dataKey="foo" nodeKey="bizzle" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('Toggles on correctly', () => {
    const data = {
      root$toggle: { on: true },
    };
    const wrapper = mount(<Test data={data} />);
    expect(wrapper.find('span#test').prop('data-test-prop')).toBeDefined();
  });

  it('Toggles off correctly', () => {
    const wrapper = mount(<Test data={{}} />);
    expect(wrapper.find('span#test').prop('data-test-prop')).toBeUndefined();
  });

  it('Responds to a change in an observable store', () => {
    class Store {
      // @ts-ignore Experimental decorators warning
      @observable on = true;

      // @ts-ignore Experimental decorators warning
      @action setOn(value: boolean) { this.on = value; }
    }
    const store = new Store();
    const data = {
      root$toggle: store,
    };
    const wrapper = mount(<Test data={data} />);
    expect(wrapper.find('span#test').prop('data-test-prop')).toBeDefined();
    store.setOn(false);
    wrapper.update();
    expect(wrapper.find('span#test').prop('data-test-prop')).toBeUndefined();
  });
});

describe('ifBodilessToggleOn and ifBodilessToggleOff', () => {
  const withProps = (xprops: any) => (Component: ComponentType<any>|string) => (props: any) => (
    <Component {...props} {...xprops} />
  );

  const createTest = (...hocs: HOC[]) => {
    const WrappedTestComponent = flowRight(...hocs)(TestComponent);
    const Test = ({ data, ...rest }: any) => (
      <MockNodeProvider data={data}>
        <WrappedTestComponent {...rest} />
      </MockNodeProvider>
    );
    return Test;
  };

  const Test = createTest(
    ifBodilessTogggleOn('toggle')(
      withProps({ 'data-hoc-foo': true }),
    ),
    ifBodilessToggleOff('toggle')(
      withProps({ 'data-hoc-bar': true }),
    ),
  );

  it('ifBodilessToggleOn preserves the node path of the wrapped component', () => {
    const Test1 = createTest(
      ifBodilessTogggleOn('toggle')(
        withProps({ 'data-hoc-foo': true }),
      ),
    );
    const data = {
      root$toggle: { on: true },
      root$component: { foo: 'bar' },
    };
    let wrapper = mount(<Test1 data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
    delete data.root$toggle;
    wrapper = mount(<Test1 data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('ifBodilessToggleOff preserves the node path of the wrapped component', () => {
    const Test1 = createTest(
      ifBodilessToggleOff('toggle')(
        withProps({ 'data-hoc-foo': true }),
      ),
    );
    const data = {
      root$toggle: { on: true },
      root$component: { foo: 'bar' },
    };
    let wrapper = mount(<Test1 data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
    delete data.root$toggle;
    wrapper = mount(<Test1 data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('applies hocs correctly when toggled on', () => {
    const data = {
      root$toggle: { on: true },
    };
    const wrapper = mount(<Test data={data} />);
    expect(wrapper.find('span#test').prop('data-hoc-foo')).toBeDefined();
    expect(wrapper.find('span#test').prop('data-hoc-bar')).toBeUndefined();
  });

  it('applies hocs correctly when toggled off', () => {
    const data = {
      root$toggle: { on: false },
    };
    const wrapper = mount(<Test data={data} />);
    expect(wrapper.find('span#test').prop('data-hoc-foo')).toBeUndefined();
    expect(wrapper.find('span#test').prop('data-hoc-bar')).toBeDefined();
  });
});

describe('withBodilessToggleButton', () => {
  const optionValue = (option: any) => (typeof option === 'function' ? option() : option);
  const TestComponent$ = (props: any) => {
    const { wrap, unwrap, ...rest } = props;
    return <TestComponent {...rest} />;
  };

  const TestComponentWithButton = withBodilessToggleButton('toggle')(TestComponent$);
  const Test = ({ data, ...rest }: any) => (
    <MockNodeProvider data={data}>
      <TestComponentWithButton {...rest} />
    </MockNodeProvider>
  );

  const getMenuOption = (wrapper: ReactWrapper<any, any>) => {
    const props = wrapper.find(PageContextProvider).props();
    const { getMenuOptions }: any = props;
    expect(typeof getMenuOptions).toBe('function');
    return getMenuOptions!()[0];
  };

  it('Preserves the node path of the wrapped component', () => {
    const data = {
      root$toggle: { on: true },
      root$component: { foo: 'bar' },
    };
    const wrapper = mount(<Test data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('Preserves the node path of the wrapped component when toggled off', () => {
    const data = {
      root$component: { foo: 'bar' },
    };
    const wrapper = mount(<Test data={data} dataKey="foo" />);
    expect(wrapper.find('span#test').prop('data-node-value')).toBe('bar');
  });

  it('Passes the correct base ptions to MenuOptinosProvider when toggled on', () => {
    const data = {
      root$toggle: { on: true },
    };
    const wrapper = mount(<Test data={data} />);
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeTruthy();
    expect(optionValue(option.icon)).toBe('toggle_on');
    option.handler();
    expect(mockSetNode).toHaveBeenCalledWith(['root', 'toggle'], { on: false });
  });

  it('Passes the correct base options to MenuOptinosProvider when toggled off', () => {
    const data = {
      root$toggle: { on: false },
    };
    const wrapper = mount(<Test data={data} />);
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeFalsy();
    expect(optionValue(option.icon)).toBe('toggle_off');
    option.handler();
    expect(mockSetNode).toHaveBeenCalledWith(['root', 'toggle'], { on: true });
  });

  it('Passes the correct base options to MenuOptinosProvider when toggled on', () => {
    const data = {
      root$toggle: { on: true },
    };
    const wrapper = mount(<Test data={data} />);
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeTruthy();
    expect(optionValue(option.icon)).toBe('toggle_on');
    option.handler();
    expect(mockSetNode).toHaveBeenCalledWith(['root', 'toggle'], { on: false });
  });

  it('Uses correct default data', () => {
    const TestDefault = withBodilessToggleButton('toggle', { on: true })(TestComponent$);
    const wrapper = mount(<TestDefault dataKey="on" />);
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeTruthy();
  });

  it('Overrides default data properly', () => {
    const data = {
      root$toggle: { on: false },
    };
    const TestDefault = withBodilessToggleButton('toggle', { on: true })(TestComponent$);
    const wrapper = mount((
      <MockNodeProvider data={data}>
        <TestDefault />
      </MockNodeProvider>
    ));
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeFalsy();
  });

  it('Accepts menu option overrides', () => {
    const useOverrides = (props: any) => {
      const on = useBodilessToggle(props);
      return {
        isActive: true,
        isHidden: !on,
        icon: 'foo',
      };
    };
    const TestOver = withBodilessToggleButton('toggle', undefined, useOverrides)(TestComponent$);
    const wrapper = mount(<TestOver />);
    const option = getMenuOption(wrapper);
    expect(optionValue(option.isActive)).toBeTruthy();
    expect(optionValue(option.isHidden)).toBeTruthy();
    expect(optionValue(option.icon)).toBe('foo');
  });
});
