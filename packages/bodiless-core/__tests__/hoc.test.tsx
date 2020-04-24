import React, { ComponentType } from 'react';
import { shallow, mount } from 'enzyme';
import { observable } from 'mobx';
import {
  withContextActivator,
  withLocalContextMenu,
  withNodeDataHandlers,
  withFlowToggle,
  ifToggledOn,
  ifToggledOff,
} from '../src/hoc';

const TestComponent = ({ element: Element }: any) => (
  <Element>
    <div>Test Component</div>
  </Element>
);

describe('withContextActivator', () => {
  it('should be able to pass onClick handler to component', () => {
    const ContextActivator = withContextActivator('onClick')(TestComponent);
    const active = shallow(<ContextActivator />);
    expect(active.props()).toHaveProperty('onClick');
  });
});

describe('withLocalContextMenu', () => {
  it('should wrap component and suffix its name with `WithLocalContextMenu`', () => {
    const ContextMenuChild = withLocalContextMenu('div');
    const withMenu = mount(<ContextMenuChild id="testDiv" />);
    expect(withMenu.find('#testDiv')).toHaveLength(2);
    expect(withMenu.name()).toEqual('divWithLocalContextMenu');
  });
});

describe('withNodeDataHandlers', () => {
  it('should have componentData', () => {
    const values = {
      some: Math.random(),
    };
    const data = observable(values);
    const DataComponent = withNodeDataHandlers(data)(TestComponent);
    const withProps = shallow(<DataComponent />);
    expect(withProps.props().componentData).toEqual(values);
  });
});

describe('withFlowToggle', () => {
  it('renders the correct component based on the toggle function', () => {
    const A = () => <div id="A" />;
    const B = () => <div id="B" />;
    const createToggleFunc = (isOn: boolean) => () => isOn;
    const RenderA = withFlowToggle(createToggleFunc(true))(A, B);
    const RenderB = withFlowToggle(createToggleFunc(false))(A, B);
    const wrapperA = mount(<RenderA />);
    expect(wrapperA.find('#A')).toHaveLength(1);
    expect(wrapperA.find('#B')).toHaveLength(0);
    const wrapperB = mount(<RenderB />);
    expect(wrapperB.find('#A')).toHaveLength(0);
    expect(wrapperB.find('#B')).toHaveLength(1);
  });
});

const hocA = (PassedComponent: ComponentType) => (props: JSX.IntrinsicAttributes) => (
  <PassedComponent {...props} data-id="A" />
);
const hocB = (PassedComponent: ComponentType) => (props: JSX.IntrinsicAttributes) => (
  <PassedComponent {...props} data-id="B" />
);
const C = () => <span />;

describe('ifToggledOn', () => {
  it('renders the correct component', () => {
    let Render = ifToggledOn(() => true)(hocA, hocB)(C);
    let wrapper = mount(<Render />);
    expect(wrapper.find('C[data-id="B"]')).toHaveLength(1);
    Render = ifToggledOn(() => false)(hocA, hocB)(C);
    wrapper = mount(<Render />);
    expect(wrapper.find('[data-id="B"]')).toHaveLength(0);
    expect(wrapper.find('[data-id="A"]')).toHaveLength(0);
    expect(wrapper.find('C')).toHaveLength(1);
  });
});

describe('ifToggledOff', () => {
  it('renders the correct component', () => {
    let Render = ifToggledOff(() => true)(hocA, hocB)(C);
    let wrapper = mount(<Render />);
    expect(wrapper.find(C)).toHaveLength(1);
    expect(wrapper.find('C[data-id="A"]')).toHaveLength(0);
    expect(wrapper.find('C[data-id="B"]')).toHaveLength(0);
    Render = ifToggledOff(() => false)(hocA, hocB)(C);
    wrapper = mount(<Render />);
    expect(wrapper.find('[data-id="A"]')).toHaveLength(1);
    expect(wrapper.find('C[data-id="B"]')).toHaveLength(1);
  });
});
