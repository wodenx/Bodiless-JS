import React from 'react';
import { shallow, mount } from 'enzyme';
import { observable } from 'mobx';
import {
  withContextActivator,
  withLocalContextMenu,
  withNodeDataHandlers,
  withFlowToggle,
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
