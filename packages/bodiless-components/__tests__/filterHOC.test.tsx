import React, { useState, FC } from 'react';
import { flow } from 'lodash';
import {
  withNode,
  DefaultContentNode,
  NodeProvider,
  TagType,
} from '@bodiless/core';
import { mount } from 'enzyme';
import { withFilterByTags } from '../src/filterHOC';
const mockItem = [
  { foo: { tags: [{ id: 0, name: 'foo' }] } },
  { bar: { tags: [{ id: 1, name: 'bar' }] } },
  { baz: { tags: [{ id: 1, name: 'baz' }] } },
  { bat: { tags: [{ id: 3, name: 'baz' }] } },
];
// const testTags = {
//   tags: [
//     { id: 0, name: 'foo' },
//     { id: 1, name: 'bar' },
//     { id: 2, name: 'baz' },
//     { id: 3, name: 'bat' },
//   ],
// };
// const testTags = ['foo', 'bar', 'baz', 'bat'];
const getMockNode = () => {
  const getters = {
    getNode: jest.fn((path: string[]) => {
      console.log('path', path);
      console.log(path.slice(-1));
      return { tags: path.slice(-1) };
    }),
    getKeys: jest.fn(() => Object.keys(mockItem)),
  };
  const actions = {
    setNode: jest.fn(),
    deleteNode: jest.fn(),
  };
  return new DefaultContentNode(actions, getters, '');
};

const TestDiv: FC<any> = props => <div {...props} />;

const FilterableItem = flow(
  withFilterByTags,
  withNode,
  // @TODO: Fix so that this type cast is not necessary.
)(TestDiv) as React.ComponentType<any>;

const TestFilterSelector = () => {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div>
      <div>
        <h2>Select a tag to filter by</h2>
        <button id="show-foo" type="button" onClick={() => setTags(['foo'])}>
          foo
        </button>
        <button id="show-bar" type="button" onClick={() => setTags(['bar'])}>
          bar
        </button>
        <button id="show-baz" type="button" onClick={() => setTags(['baz'])}>
          baz
        </button>
        <button id="show-bat" type="button" onClick={() => setTags(['bat'])}>
          bat
        </button>
      </div>
      <div>
        <h2>Filtered Components</h2>
        <NodeProvider node={getMockNode()}>
          <FilterableItem nodeKey="foo" selectedTags={tags} id="foo">
            foo
          </FilterableItem>
          <FilterableItem nodeKey="bar" selectedTags={tags} id="bar">
            bar
          </FilterableItem>
          <FilterableItem nodeKey="baz" selectedTags={tags} id="baz">
            baz
          </FilterableItem>
          <FilterableItem nodeKey="bat" selectedTags={tags} id="bat">
            bat
          </FilterableItem>
        </NodeProvider>
      </div>
    </div>
  );
};
describe('withFilterByTags', () => {
  it('Hides all items which do not match selected tags', () => {
    const wrapper = mount(<TestFilterSelector />);
    console.log(wrapper.debug());
    wrapper.find('#show-foo').simulate('click');
    expect(wrapper.find('div#foo')).toHaveLength(1);
    expect(wrapper.find('div#bar')).toHaveLength(0);
    expect(wrapper.find('div#baz')).toHaveLength(0);
    expect(wrapper.find('div#bat')).toHaveLength(0);
  });
});
