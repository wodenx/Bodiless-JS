import {
  PageEditContext, useNode, DefaultContentNode, NodeProvider,
  PageContextProvider,
  withNodeKey,
  withNode,
  ContentNode,
} from '@bodiless/core';
import React, { FC, Fragment } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { flow } from 'lodash';
import type { Meta, ComponentSelectorProps, ComponentWithMeta } from '../src/ComponentSelector/types';
import withContentLibrary from '../src/ContentLibrary/withContentLibrary';

const findContextMenuForm = (wrapper: ReactWrapper) => {
  const provider = wrapper.find(PageContextProvider);
  expect(provider).toBeDefined();
  const getMenuOptions = provider.prop('getMenuOptions');
  const option = getMenuOptions!().find(op => op.name === 'content-library');
  // @ts-ignore we don't need to pass an event to the handler.
  const render = option.handler();
  const formWrapper = mount(<>{render({ closeForm: jest.fn() })}</>);
  return formWrapper;
};

const createMockStore = (data: any) => {
  const actions = {
    setNode: jest.fn(),
    deleteNode: jest.fn(),
  };
  const getters = {
    getNode: jest.fn((path: string[]) => data[path.join('$')] || {}),
    getKeys: jest.fn(() => Object.keys(data)),
    hasError: false,
    getPagePath: jest.fn(() => '/'),
    getBaseResourcePath: jest.fn(() => '/'),
  };
  return { actions, getters };
};

const MockNodeProvider: FC<{ store: any }> = ({ store, children }: any) => {
  const { node } = useNode() as { node: DefaultContentNode<any> };
  const { actions, getters } = store;
  const { path } = node;
  const newNode = new DefaultContentNode(actions, getters, path);
  return (
    <NodeProvider node={newNode}>
      {children}
    </NodeProvider>
  );
};

describe('withContentlibrary', () => {
  let mockIsEdit: any;

  beforeAll(() => {
    mockIsEdit = jest.spyOn(PageEditContext.prototype, 'isEdit', 'get').mockReturnValue(true);
  });

  afterAll(() => {
    mockIsEdit.mockRestore();
  });

  const TestDisplayComponent = () => {
    const { node } = useNode();
    return <span data-display-component {...node.data} />;
  };

  const TestSelector: FC<ComponentSelectorProps> = ({ components }) => (
    <>
      {components.map((Component: ComponentWithMeta<any>) => (
        <Component key={Component.displayName} />
      ))}
    </>
  );

  it('Applies default metadata correctly', () => {
    const store = createMockStore({
      foo$bar: { foo: 'bar' },
    });
    const useLibraryNode = () => ({ node: useNode().node.peer('foo') });
    const Test = flow(
      withContentLibrary({
        DisplayComponent: TestDisplayComponent,
        Selector: TestSelector,
        useLibraryNode,
      }),
    )(Fragment);
    const wrapper = mount((
      <MockNodeProvider store={store}>
        <Test />
      </MockNodeProvider>
    ));
    const form = findContextMenuForm(wrapper);
    const [component] = form.find(TestSelector).prop('components');
    expect(component.displayName).toBe('bar');
    expect(component.title).toBe('bar');
    expect(component.description).toBe('bar');
  });

  it('Applies metadata correctly', () => {
    const store = createMockStore({
      foo$bar: { foo: 'bizzle' },
    });
    const useLibraryNode = () => ({ node: useNode().node.peer('foo') });
    const useMeta = (node: ContentNode<any>): Partial<Meta> => ({
      title: `Title: ${node.data.foo}`,
      description: `Description: ${node.data.foo}`,
      categories: {
        a: ['b', 'c'],
      },
    });
    const Test = flow(
      withContentLibrary({
        DisplayComponent: TestDisplayComponent,
        Selector: TestSelector,
        useMeta,
        useLibraryNode,
      }),
    )(Fragment);
    const wrapper = mount((
      <MockNodeProvider store={store}>
        <Test />
      </MockNodeProvider>
    ));
    const form = findContextMenuForm(wrapper);
    const [component] = form.find(TestSelector).prop('components');
    expect(component.title).toBe('Title: bizzle');
    expect(component.description).toBe('Description: bizzle');
    expect(component?.categories?.a).toEqual(['b', 'c']);
  });

  it('Lists child keys correctly', () => {
    const store = createMockStore({
      foo$bar: { foo: 'bar' },
      foo$baz: { foo: 'baz' },
      foo$bang: { foo: 'bang' },
      foo$bang$bop: { foobang: 'bop' },
    });
    const useLibraryNode = () => ({ node: useNode().node.peer('foo') });

    const Test = flow(
      withContentLibrary({
        DisplayComponent: TestDisplayComponent,
        Selector: TestSelector,
        useLibraryNode,
      }),
    )(Fragment);

    const wrapper = mount((
      <MockNodeProvider store={store}>
        <Test />
      </MockNodeProvider>
    ));
    const spans = findContextMenuForm(wrapper).find('span[data-display-component]');
    expect(spans.at(0).prop('foo')).toBe('bar');
    expect(spans.at(1).prop('foo')).toBe('baz');
    expect(spans.at(2).prop('foo')).toBe('bang');
    expect(spans).toHaveLength(3);
  });

  it('Copies content correctly', () => {
    const store = createMockStore({
      foo$bar: { foo: 'bar' },
      foo$baz: { foo: 'baz' },
      foo$bang: { foo: 'bang' },
      foo$bang$bop: { foobang: 'bop' },
    });
    const useLibraryNode = () => ({ node: useNode().node.peer('foo') });

    const Test = flow(
      withContentLibrary({
        DisplayComponent: TestDisplayComponent,
        Selector: TestSelector,
        useLibraryNode,
      }),
      withNode,
      withNodeKey('flaboozle'),
    )(TestDisplayComponent);

    const wrapper = mount((
      <MockNodeProvider store={store}>
        <Test />
      </MockNodeProvider>
    ));
    const formWrapper = findContextMenuForm(wrapper);
    const selector = formWrapper.find(TestSelector);
    const { onSelect } = selector.props();
    onSelect(['bar']);
    expect(store.actions.setNode).toBeCalledWith(['root', 'flaboozle'], {
      foo: 'bar',
    });
  });
});
