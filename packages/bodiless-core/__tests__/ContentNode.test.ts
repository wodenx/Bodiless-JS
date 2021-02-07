/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DefaultContentNode } from '../src/ContentNode';

const mockStore = () => {
  const getNode = jest.fn();
  const setNode = jest.fn();
  const hasError = jest.fn();
  const getKeys = jest.fn(() => ['foo']);
  const getPagePath = jest.fn(() => '/');
  const getBaseResourcePath = jest.fn(() => '/');
  const deleteNode = jest.fn();
  const actions = { setNode, deleteNode };
  const getters = {
    getKeys, getNode, hasError, getPagePath, getBaseResourcePath,
  };
  return { actions, getters };
};

type D1 = {
  foo: string;
};

type D2 = {
  bar: string;
};

describe('ContentNode', () => {
  it('Correctly splits a compound path', () => {
    const { actions, getters } = mockStore();
    const node = new DefaultContentNode(actions, getters, 'foo$bar$baz');
    expect(node.path).toEqual(['foo', 'bar', 'baz']);
  });

  it('Invokes getters and setters correctly', () => {
    const keys = [Math.random().toString(), Math.random().toString()];
    const { actions, getters } = mockStore();
    const node = new DefaultContentNode<D1>(actions, getters, keys);

    const d = node.data;
    expect(getters.getNode.mock.calls.length).toBe(1);
    expect(getters.getNode.mock.calls[0].length).toBe(1);
    expect(getters.getNode.mock.calls[0][0]).toEqual(keys);
    expect(d).toBeUndefined();

    const e = {
      foo: 'bar',
    };

    node.setData(e);
    expect(actions.setNode.mock.calls.length).toBe(1);
    expect(actions.setNode.mock.calls[0].length).toBe(2);
    expect(actions.setNode.mock.calls[0][0]).toEqual(keys);
    expect(actions.setNode.mock.calls[0][1]).toEqual(e);

    const { keys: mockKeys } = node;
    expect(getters.getKeys.mock.calls.length).toBe(1);
    expect(getters.getKeys.mock.calls[0].length).toBe(0);
    expect(mockKeys.length).toBe(1);
    expect(mockKeys[0]).toBe('foo');
  });

  it('Spawns peers and children correctly', () => {
    const { actions, getters } = mockStore();
    const rootKey = Math.random().toString();
    const rootNode = new DefaultContentNode(actions, getters, rootKey);

    const data = {
      bar: Math.random().toString(),
    };

    const peerKey = Math.random().toString();
    const peerNode = rootNode.peer<D2>(peerKey);
    peerNode.setData(data);
    expect(actions.setNode.mock.calls[0][0]).toEqual([peerKey]);
    expect(actions.setNode.mock.calls[0][1]).toEqual(data);

    actions.setNode.mockReset();
    const childKey = Math.random().toString();
    const childNode = peerNode.child<D2>(childKey);
    childNode.setData(data);
    expect(actions.setNode.mock.calls[0][0]).toEqual([peerKey, childKey]);
    expect(actions.setNode.mock.calls[0][1]).toEqual(data);
  });

  it('Returns child keys properly', () => {
    const { actions, getters } = mockStore();
    getters.getKeys.mockReturnValue(
      ['foo', 'bar', 'foo$baz', 'foo$bing', 'foo$baz$bat'],
    );
    const node = new DefaultContentNode(actions, getters, 'foo');
    expect(node.childKeys).toEqual(['baz', 'bing']);
  });

  describe('ContentNode.proxy', () => {
    beforeEach(() => { jest.clearAllMocks(); });
    const content: { [k: string]: any } = {
      Root$foo: { value: 'FooValue' },
      Root$foo$bar: { value: 'BarValue' },
      Root$baz: { value: 'BazValue' },
    };
    const { actions, getters } = mockStore();
    getters.getNode.mockImplementation((key: string[]) => content[key.join('$')]);
    getters.getKeys.mockReturnValue(Object.keys(content));

    describe('getData', () => {
      const processors = {
        getData: jest.fn().mockImplementation((data: any) => ({ ...data, extra: 'Extra' })),
      };
      const rootNode = new DefaultContentNode(actions, getters, 'Root');

      it('Passes data through a processor', () => {
        const test = rootNode.proxy(processors);
        const r = test.data;
        expect(r).toEqual({ extra: 'Extra' });
      });

      it('Passes data for descendents through a processor', () => {
        const parent = rootNode.proxy(processors);
        const child = parent.child('foo');
        const grandChild = child.child('bar');
        expect(child.data).toEqual({ value: 'FooValue', extra: 'Extra' });
        expect(grandChild.data).toEqual({ value: 'BarValue', extra: 'Extra' });
      });

      it('Applies multiple processors', () => {
        const processors2 = {
          getData: jest.fn().mockImplementation((data: any) => ({ ...data, extra2: 'Extra2' })),
        };
        const parent = rootNode.proxy(processors);
        const child = parent.child('foo').proxy(processors2);
        expect(child.data).toEqual({ value: 'FooValue', extra: 'Extra', extra2: 'Extra2' });
      });

      it('Does not alter other methods', () => {
        const node = rootNode.proxy(processors);
        node.setData({ value: 'New' });
        expect(actions.setNode).toBeCalledWith(['Root'], { value: 'New' });
        expect(node.keys).toEqual(Object.keys(content));
        expect(getters.getKeys).toBeCalledTimes(1);
      });
    });

    describe('setData', () => {
      const processors = {
        setData: jest.fn().mockImplementation((data: any) => ({ ...data, extra: 'Extra' })),
      };
      const rootNode = new DefaultContentNode(actions, getters, 'Root');

      it('Passes data through a processor', () => {
        const test = rootNode.proxy(processors);
        test.setData({ value: 'RootValue' });
        expect(actions.setNode).toBeCalledWith(['Root'], { value: 'RootValue', extra: 'Extra' });
      });

      it('Passes data for descendents through a processor', () => {
        const parent = rootNode.proxy(processors);
        const child = parent.child('child');
        child.setData({ value: 'ChildData' });
        expect(actions.setNode).toBeCalledWith(['Root', 'child'], { value: 'ChildData', extra: 'Extra' });
        actions.setNode.mockClear();
        const grand = child.child('grand');
        grand.setData({ value: 'GrandValue' });
        expect(actions.setNode).toBeCalledWith(['Root', 'child', 'grand'], { value: 'GrandValue', extra: 'Extra' });
      });

      it('Applies multiple processors', () => {
        const processors2 = {
          setData: jest.fn().mockImplementation((data: any) => ({ ...data, extra2: 'extra2' })),
        };
        const parent = rootNode.proxy(processors);
        const child = parent.child('child').proxy(processors2);
        child.setData({ value: 'ChildValue' });
        expect(actions.setNode).toBeCalledWith(['Root', 'child'], { value: 'ChildValue', extra: 'Extra', extra2: 'extra2' });
      });

      it('Does not alter other methods', () => {
        const node = rootNode.proxy(processors).child('foo');
        node.setData({ vaue: 'Foo' });
        expect(node.keys).toEqual(Object.keys(content));
        expect(node.data).toEqual(content.Root$foo);
      });
    });
  
    describe('getKeys', () => {
      const processors = {
        getKeys: jest.fn().mockImplementation(
          (keys: string[]) => keys.filter(k => k !== 'Root$foo$bar'),
        ),
      };

      const processors2 = {
        getKeys: jest.fn().mockImplementation(
          (keys: string[]) => [...keys, 'Root$foo$bing'],
        ),
      };
      const rootNode = new DefaultContentNode(actions, getters, 'Root');

      it('Passes data through a processor', () => {
        const test = rootNode.proxy(processors);
        const r = test.keys;
        expect(r).toEqual(['Root$foo', 'Root$baz']);
        expect(processors.getKeys).toBeCalledWith(Object.keys(content));
      });

      it('Passes data for descendents through a processor', () => {
        const parent = rootNode.proxy(processors);
        const child = parent.child('foo');
        const grandChild = child.child('bar');
        expect(child.keys).toEqual(['Root$foo', 'Root$baz']);
        expect(grandChild.keys).toEqual(['Root$foo', 'Root$baz']);
      });

      it('Applies multiple processors', () => {
        const parent = rootNode.proxy(processors);
        const child = parent.child('foo').proxy(processors2);
        expect(child.keys).toEqual(['Root$foo', 'Root$baz', 'Root$foo$bing']);
      });

      it('Does not alter other methods', () => {
        const node = rootNode.proxy(processors).child('baz');
        node.setData({ value: 'New' });
        expect(actions.setNode).toBeCalledWith(['Root', 'baz'], { value: 'New' });
        expect(node.data).toEqual(content.Root$baz);
      });

      it('Returns child keys properly', () => {
        const node = rootNode.proxy(processors);
        expect(node.childKeys).toEqual(['foo', 'baz']);
        const child = node.proxy(processors2).child('foo');
        expect(child.childKeys).toEqual(['bing']);
      });
    });
  });
});
