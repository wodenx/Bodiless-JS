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
import {
  designable, Div, Button,
} from '@bodiless/fclasses';
import { FilterByGroupComponents, FilterByGroupProps } from './types';
import FilterClean from './Filter';

import Tag from './FilterByGroupTag';
import { useFilterByGroupContext } from './FilterByGroupProvider';
import { withFilterByGroupContext, useFilterByGroupContext as useContext } from './FilterByGroupContext';

const FilterByGroupComponentsStart:FilterByGroupComponents = {
  Wrapper: Div,
  FilterWrapper: Div,
  ContentWrapper: Div,
  ResetButton: Button,
  Filter: FilterClean,
};

const FilterByGroupBase: FC<FilterByGroupProps> = ({ components, children, ...rest }) => {
  const {
    Wrapper,
    FilterWrapper,
    ContentWrapper,
    ResetButton,
    Filter,
  } = components;

  const {
    tags,
    updateSelectedTag,
    updateTags,
    deleteTag,
    selectedTag,
    getTagById,
  } = useFilterByGroupContext();

  const { name } = useContext();
  console.log(name)

  return (
    <Wrapper {...rest}>
      <FilterWrapper>
        <ResetButton onClick={() => updateSelectedTag('')}>Reset</ResetButton>
        <ResetButton onClick={() => updateTags([...tags, new Tag('test')])}>Add</ResetButton>
        <ResetButton onClick={() => deleteTag(selectedTag)}>Delete Selected</ResetButton>
        <Filter />
      </FilterWrapper>
      <ContentWrapper>
        {children}
        <strong>Selected Tag: </strong> {JSON.stringify(getTagById(selectedTag || ''), null, 2)} <br />
        <strong>All Tags: </strong> <br /> {JSON.stringify(tags, null, 2)}
      </ContentWrapper>
    </Wrapper>
  );
};

const FilterByGroupClean = flow(
  withFilterByGroupContext({ name: 'TestName' }),
  designable(FilterByGroupComponentsStart),
)(FilterByGroupBase);

export default FilterByGroupClean;
