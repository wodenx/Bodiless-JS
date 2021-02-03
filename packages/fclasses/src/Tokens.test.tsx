import React, { Fragment } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import Tokens from './Tokens';
import type { Token } from './Tokens';

const addProp = (name?: string, value?: string): Token => Comp => (props: any) => {
  if (!name) return <Comp {...props} />;
  const propsToAdd = {
    [name]: value || name,
  };
  return <Comp {...propsToAdd} {...props} />;
};

describe('Tokens.flow', () => {
  describe('addProp helper', () => {
    const Base = () => <></>;
    it('Adds a prop', () => {
      const Test = addProp('foo', 'bar')(Base);
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).props()).toEqual({
        foo: 'bar',
      });
    });

    it('Adds a prop with default value', () => {
      const Test = addProp('foo')(Base);
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).props()).toEqual({
        foo: 'foo',
      });
    });

    it('Allows added props to be overridden', () => {
      const Test = addProp('foo', 'bar')(Base);
      const wrapper = mount(<Test foo="baz" />);
      expect(wrapper.find(Base).props()).toEqual({
        foo: 'baz',
      });
    });
  });

  describe('HOC order', () => {
    const Base = () => <></>;
    it('Applies hocs left to right', () => {
      const asTest = Tokens.flow(
        addProp('foo'),
        addProp('foo', 'bar'),
      );
      const Test = asTest(Base);
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).prop('foo')).toBe('bar');
    });

    it('Applies hocs left to right including nested tokens', () => {
      const asFoo = Tokens.flow(
        addProp('foo'),
      );
      const asTest = Tokens.flow(
        asFoo,
        addProp('foo', 'bar'),
      );
      const Test = asTest(Base);
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).prop('foo')).toBe('bar');
    });
  });

  describe('Meta propagation', () => {
    it('Propagates original metadata', () => {
      const Base = () => <></>;
      Base.title = 'BaseTitle';
      const asPropagate = Tokens.flow(addProp('prop'));
      const Wrong = addProp()(Base);
      expect(Wrong.title).toBeUndefined();
      const Right = asPropagate(Base);
      expect(Right.title).toBe('BaseTitle');
    });

    it('Propagates added metadata', () => {
      const withNewMeta = Tokens.flow(
        Tokens.meta.term('Type')('New'),
        addProp(),
      );
      const Test = withNewMeta(Fragment);
      expect(Test.categories?.Type.includes('New')).toBeTruthy();
    });

    it('Merges categories', () => {
      const Base = () => <></>;
      Base.categories = { Type: ['Base'] };
      const asTest = Tokens.flow(
        Tokens.meta.term('Type')('Foo'),
      );
      const Test = asTest(Base);
      expect(Test.categories).toEqual({ Type: ['Base', 'Foo'] });
    });

    it('Overwrites titles', () => {
      const Base = () => <></>;
      Base.title = 'BaseTitle';
      const asTest = Tokens.flow(
        { title: 'Foo' },
      );
      const Test = asTest(Base);
      expect(Test.title).toBe('Foo');
    });

    it('Adds metaata from nested tokens', () => {
      const asFoo = Tokens.flow(Tokens.meta.term('Type')('Foo'));
      const asBar = Tokens.flow(Tokens.meta.term('Type')('Bar'));
      const asBaz = Tokens.flow(asBar, Tokens.meta.term('Type')('Baz'));
      const asTest = Tokens.flow(
        asFoo,
        asBaz,
        { title: 'Test' },
        Tokens.meta.term('Type')('Test'),
      );
      const Test = asTest(Fragment);
      expect(Test.title).toBe('Test');
      expect(Test.categories).toEqual({
        Type: ['Foo', 'Bar', 'Baz', 'Test'],
      });
    });
  });

  describe('Filtering', () => {
    const Base = () => <></>;
    const asFoo = Tokens.flow(
      Tokens.meta.term('Type')('Filtered'),
      Tokens.meta.term('Name')('Foo'),
      addProp('foo'),
    );

    const asBar = Tokens.flow(
      Tokens.meta.term('Type')('Unfiltered'),
      Tokens.meta.term('Name')('Bar'),
      addProp('bar'),
    );

    const filter = Tokens.filter(t => !t.meta?.categories?.Type?.includes('Filtered'));

    it('Filters flat tokens', () => {
      const asTest = Tokens.flow(asFoo, asBar);
      const asFiltered = Tokens.flow(asTest, filter);
      const Test = asTest(Base);
      const Filtered = asFiltered(Base);
      expect(Test.categories).toEqual({
        Type: ['Filtered', 'Unfiltered'],
        Name: ['Foo', 'Bar'],
      });
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).props()).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
      expect(Filtered.categories).toEqual({
        Type: ['Unfiltered'],
        Name: ['Bar'],
      });
      const wrapperF = mount(<Filtered />);
      expect(wrapperF.find(Base).props()).toEqual({
        bar: 'bar',
      });
    });

    it('Filters nested tokens', () => {
      const withNestedFoo = Tokens.flow(
        asFoo,
        Tokens.meta.term('Name')('NestedFoo'),
        addProp('nestedFoo'),
      );
      const asTest = Tokens.flow(withNestedFoo, asBar);
      const asFiltered = Tokens.flow(asTest, filter);
      const Test = asTest(Base);
      const Filtered = asFiltered(Base);
      expect(Test.categories).toEqual({
        Type: ['Filtered', 'Unfiltered'],
        Name: ['Foo', 'NestedFoo', 'Bar'],
      });
      const wrapper = mount(<Test />);
      expect(wrapper.find(Base).props()).toEqual({
        foo: 'foo',
        bar: 'bar',
        nestedFoo: 'nestedFoo',
      });
      expect(Filtered.categories).toEqual({
        Type: ['Unfiltered'],
        Name: ['NestedFoo', 'Bar'],
      });
      const wrapperF = mount(<Filtered />);
      expect(wrapperF.find(Base).props()).toEqual({
        bar: 'bar',
        nestedFoo: 'nestedFoo',
      });
    });

    it('Propagates a filter', () => {
      const asBarNotFoo = Tokens.flow(filter, asBar);
      const asTest = Tokens.flow(asFoo, asBarNotFoo);
      const Test = asTest(Base);
      expect(Test.categories).toEqual({
        Type: ['Unfiltered'],
        Name: ['Bar'],
      });
      const wrapperF = mount(<Test />);
      expect(wrapperF.find(Base).props()).toEqual({
        bar: 'bar',
      });
    });
  });
});
