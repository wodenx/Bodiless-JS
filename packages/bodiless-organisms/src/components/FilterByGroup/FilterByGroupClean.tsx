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
import { flow } from 'lodash';
import { observer } from 'mobx-react-lite';
import {
  designable, Div, Button, addClasses,
} from '@bodiless/fclasses';
import { FilterByGroupComponents, FilterByGroupProps } from './types';
import FilterClean from './Filter';
import Tag from './FilterByGroupTag';
import {
  withFilterByGroupContext,
  useFilterByGroupContext,
} from './FilterByGroupContext';

const FilterByGroupComponentsStart:FilterByGroupComponents = {
  Wrapper: Div,
  FilterWrapper: Div,
  ContentWrapper: Div,
  ResetButton: Button,
  Filter: FilterClean,
};

const AddButton = addClasses('px-2 mb-2 border border-gray-600')(Button);
const TagComponent = addClasses('px-3 my-2 mr-2 mb-2 border border-gray-600 inline-block')(Div);

const FilterByGroupBase: FC<FilterByGroupProps> = ({ components, children, ...rest }) => {
  const {
    Wrapper,
    FilterWrapper,
    ContentWrapper,
    ResetButton,
    Filter,
  } = components;

  const { allTags, selectedTag } = useFilterByGroupContext();
  const context = useFilterByGroupContext();

  /* eslint-disable no-bitwise */
  const addRandomTag = () => context.addTag(new Tag(`#${(Math.random() * 0xFFFFFF << 0).toString(16)}`));

  const tagElements = allTags.map(tag => (
    <TagComponent>{ tag.name }</TagComponent>
  )).reverse();

  return (
    <Wrapper {...rest}>
      <FilterWrapper>
        <ResetButton onClick={() => context.setSelectedTag()}>Reset</ResetButton>
        <Filter />
      </FilterWrapper>
      <ContentWrapper>
        {children}
        <Div>
          <AddButton onClick={() => addRandomTag()}>Add Random Tag</AddButton>
          <br />

          <strong>Selected Tag: </strong>
          <pre>
            {JSON.stringify(selectedTag, null, 2)}
          </pre>

          <strong>All Tags: </strong>
          <Div>
            { tagElements }
            <pre>
              {JSON.stringify(allTags, null, 2)}
            </pre>
          </Div>

        </Div>
      </ContentWrapper>
    </Wrapper>
  );
};

const suggestions = [
  { id: '1', name: 'DefaultTag 1' },
  { id: '2', name: 'DefaultTag 2' },
];

const FilterByGroupClean = flow(
  observer,
  withFilterByGroupContext({ suggestions }),
  designable(FilterByGroupComponentsStart),
)(FilterByGroupBase);

export default FilterByGroupClean;
