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
  designable,
  withDesign,
  addClasses,
  Div,
  H3,
  Input,
  Label,
} from '@bodiless/fclasses';
import { FilterComponents, FilterProps } from './types';

const FilterByGroupComponentsStart:FilterComponents = {
  FilterWrapper: Div,
  FilterCategory: H3,
  FilterGroupsWrapper: Div,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const FilterBase: FC<FilterProps> = ({ components }) => {
  const {
    FilterWrapper,
    FilterCategory,
    FilterGroupItem,
    FilterGroupsWrapper,
    FilterInputWrapper,
  } = components;

  const [selectedItem, setSelectedItem] = useState('');

  const testTags = [
    {
      category: 'Filter Category 1',
      groups: ['group-item-1', 'group-item-2', 'group-item-3'],
    },
    {
      category: 'Filter Category 2',
      groups: ['group-item-2-1', 'group-item-2-2', 'group-item-2-3'],
    },
    {
      category: 'Filter Category 3',
      groups: ['group-item-3-1', 'group-item-3-2', 'group-item-3-3'],
    },
  ];

  return (
    <FilterWrapper>
      { testTags.map(filter => (
        <React.Fragment key={filter.category}>
          <FilterCategory>{ filter.category }</FilterCategory>
          <FilterGroupsWrapper>
            {filter.groups.map(group => (
              <FilterInputWrapper key={group}>
                <FilterGroupItem type="radio" name="group-item" value={group} id={group} onChange={() => setSelectedItem(group)} checked={selectedItem === group} />
                <Label htmlFor={group}>{ group }</Label>
              </FilterInputWrapper>
            ))}
          </FilterGroupsWrapper>
        </React.Fragment>
      )) }
      <button type="button" onClick={() => setSelectedItem('')}>Reset</button>
    </FilterWrapper>
  );
};

const FilterClean = flow(
  designable(FilterByGroupComponentsStart),
)(FilterBase);

const asBodilessFilter = withDesign({
  FilterCategory: addClasses('font-bold'),
  FilterGroupItem: addClasses('mr-3'),
  FilterInputWrapper: addClasses('flex p-2 items-center'),
});

export default asBodilessFilter(FilterClean);
