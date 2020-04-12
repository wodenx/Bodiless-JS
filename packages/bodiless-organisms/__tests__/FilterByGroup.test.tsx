/**
 * Copyright © 2020 Johnson & Johnson
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

import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';

import FilterByGroup from '../src/components/FilterByGroup/FilterByGroupTestable';
import Filter from '../src/components/FilterByGroup/Filter';
import { useFilterByGroupContext } from '../src/components/FilterByGroup/FilterByGroupContext';
import {
  FBGContextInterface,
} from '../src/components/FilterByGroup/types';

type Props = {
  onAdd: (context: FBGContextInterface) => void,
  force: string,
};

// Component which prints values of the current context.
const ContextLogger: FC<Props> = ({ onAdd }) => {
  const FBGContext: FBGContextInterface = useFilterByGroupContext();

  const tags = FBGContext.allTags.map(tag => (<span id={tag.id} key={tag.id}>{tag.name}</span>));

  return (
    <>
      <button type="button" id="add-tag-button" onClick={() => onAdd(FBGContext)}>Add</button>
      <button type="button" id="tag-reset" onClick={() => FBGContext.setSelectedTag()}>Reset</button>
      <span id="all-tags">{FBGContext.allTags.length}</span>
      <span id="selected-tag">
        {
          FBGContext.selectedTag
            ? FBGContext.selectedTag.name
            : ''
        }
      </span>
      {tags}
    </>
  );
};

describe('Filter By Group', () => {
  it('should render Filter, ContentWrapper and ResetButton', () => {
    const wrapper = mount(
      <FilterByGroup />,
    );

    expect(wrapper.find(Filter).length).toBe(1);
    expect(wrapper.find('div[data-filter-by-group="content-wrapper"]').length).toBe(1);
    expect(wrapper.find('button[aria-label="Reset Button"]').length).toBe(1);
  });

  it('should add default suggestions to the context', () => {
    const suggestions = [
      { id: 'test-id-1', name: 'Test Tag 1' },
      { id: 'test-id-2', name: 'Test Tag 2' },
    ];

    const wrapper = mount(
      <FilterByGroup suggestions={suggestions}>
        <ContextLogger onAdd={() => {}} force="foo" />
      </FilterByGroup>,
    );

    expect(wrapper.find('#all-tags').text()).toBe('2');
    expect(wrapper.find('#test-id-1').length).toBe(1);
    expect(wrapper.find('#test-id-2').length).toBe(1);
    expect(wrapper.find('#test-id-1').text()).toBe('Test Tag 1');
    expect(wrapper.find('#test-id-2').text()).toBe('Test Tag 2');
  });

  it('should provide a method to add tags to the context', () => {
    const suggestions = [
      { id: 'test-id-1', name: 'Test Tag 1' },
      { id: 'test-id-2', name: 'Test Tag 2' },
    ];
    const newTag = { id: 'new-tag-id', name: 'New Tag' };
    const addNewTag = (context: FBGContextInterface) => context.addTag(newTag);

    const Test: FC<Props> = ({ force, onAdd }) => (
      <FilterByGroup suggestions={suggestions}>
        <ContextLogger onAdd={onAdd} force={force} />
      </FilterByGroup>
    );

    const wrapper = mount(<Test force="foo" onAdd={addNewTag} />);

    expect(wrapper.find('#all-tags').text()).toBe('2');
    wrapper.find('#add-tag-button').simulate('click');
    wrapper.setProps({ force: 'bar' });
    expect(wrapper.find('#all-tags').text()).toBe('3');
    expect(wrapper.find('#new-tag-id').text()).toBe('New Tag');
  });

  it('should provide a method to set selected tag', () => {
    const tagToSelect = { id: '1', name: 'Selected Tag' };

    const Test: FC<Props> = ({ force, onAdd }) => {
      const FBGContext: FBGContextInterface = useFilterByGroupContext();

      return (
        <FilterByGroup>
          <button type="button" id="select-tag-button" onClick={() => FBGContext.setSelectedTag(tagToSelect)} />
          <ContextLogger onAdd={onAdd} force={force} />
        </FilterByGroup>
      );
    };

    const wrapper = mount(<Test force="foo" onAdd={() => {}} />);
    expect(wrapper.find('#selected-tag').text()).toBe('');

    wrapper.find('#select-tag-button').simulate('click');
    wrapper.setProps({ force: 'bar' });
    expect(wrapper.find('#selected-tag').text()).toBe('Selected Tag');

    wrapper.find('button[aria-label="Reset Button"]').simulate('click');
    wrapper.setProps({ force: 'bar' });
    expect(wrapper.find('#selected-tag').text()).toBe('');
  });
});