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

import React, { FC, useState } from 'react';
import { flow } from 'lodash';
import {
  designable, Div, Button, Label, H3, Input,
} from '@bodiless/fclasses';
import { FilterByGroupComponents, FilterByGroupProps } from './types';

const FilterByGroupComponentsStart:FilterByGroupComponents = {
  Wrapper: Div,
  FilterWrapper: Div,
  ContentWrapper: Div,
  ResetButton: Button,
  Filter: Div,
  FilterCategory: H3,
  FilterGroupWrapper: Div,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const FilterByGroupBase: FC<FilterByGroupProps> = ({ components, children, ...rest }) => {
  const {
    Wrapper,
    FilterWrapper,
    ContentWrapper,
    ResetButton,
    Filter,
    FilterCategory,
    FilterGroupItem,
    FilterGroupWrapper,
    FilterInputWrapper,
  } = components;

  const testTags = [
    {
      category: 'Filter Category 1',
      tags: [
        {id: 'group-item-1', name: 'group-item-1'},
        {id: 'group-item-2', name: 'group-item-2'},
        {id: 'group-item-3', name: 'group-item-3'},
      ],
    },
    {
      category: 'Filter Category 2',
      tags: [
        {id: 'group-item-2-1', name: 'group-item-2-1'},
        {id: 'group-item-2-2', name: 'group-item-2-2'},
        {id: 'group-item-2-3', name: 'group-item-2-3'},
      ],
    },
    {
      category: 'Filter Category 3',
      tags: [
        {id: 'group-item-3-1', name: 'group-item-3-1'},
        {id: 'group-item-3-2', name: 'group-item-3-2'},
        {id: 'group-item-3-3', name: 'group-item-3-3'},
      ],
    },
  ];

  const [selectedTagName, setSelectedTag] = useState('');

  return (
    <Wrapper {...rest}>
      <FilterWrapper>
        <ResetButton onClick={() => setSelectedTag('')}>Reset</ResetButton>
        <Filter>
          { testTags.map(filter => (
            <React.Fragment key={filter.category}>
              <FilterCategory>{ filter.category }</FilterCategory>
              <FilterGroupWrapper>
                {filter.tags.map(tag => (
                  <FilterInputWrapper key={tag.id}>
                    <FilterGroupItem type="radio" name="filter-item" value={tag} id={tag.id} onChange={() => setSelectedTag(tag.name)} checked={selectedTagName === tag.name} />
                    <Label htmlFor={tag.id}>{ tag.name }</Label>
                  </FilterInputWrapper>
                ))}
              </FilterGroupWrapper>
            </React.Fragment>
          )) }
        </Filter>
      </FilterWrapper>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};

const FilterByGroupClean = flow(
  designable(FilterByGroupComponentsStart),
)(FilterByGroupBase);

export default FilterByGroupClean;
