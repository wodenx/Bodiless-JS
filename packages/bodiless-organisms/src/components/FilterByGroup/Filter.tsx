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
import { designable, withDesign, addProps, addClasses, Div, H3, Input, Label } from '@bodiless/fclasses';
import { FilterComponents, FilterProps } from './types';

const FilterByGroupComponentsStart:FilterComponents = {
  FilterWrapper: Div,
  FilterCategory: H3,
  FilterGroupWrapper: Div,
  FilterGroupItem: flow(
    addProps({ 'type': 'radio' }),
  )(Input),
};

const Filter: FC<FilterProps> = ({ components, children }) => {
  const {
    FilterWrapper,
    FilterCategory,
    FilterGroupItem,
    FilterGroupWrapper,
  } = components;

  return (
    <FilterWrapper>
      <FilterCategory>
        Filter Category 1
      </FilterCategory>
      <FilterGroupWrapper>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-1" id="group-item-1" />
          <Label htmlFor="group-item-1">group-item-1</Label>
        </div>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-2" id="group-item-2" />
          <Label htmlFor="group-item-2">group-item-2</Label>
        </div>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-3" id="group-item-3" />
          <Label htmlFor="group-item-3">group-item-2</Label>
        </div>
      </FilterGroupWrapper>

      <FilterCategory>
        Filter Category 2
      </FilterCategory>
      <FilterGroupWrapper>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-2-1" id="group-item-2-1" />
          <Label htmlFor="group-item-2-1">group-item-2-1</Label>
        </div>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-2-2" id="group-item-2-2" />
          <Label htmlFor="group-item-2-2">group-item-2-2</Label>
        </div>
        <div className="flex p-2 items-center">
          <FilterGroupItem name="group-item" value="group-item-2-3" id="group-item-2-3" />
          <Label htmlFor="group-item-2-3">group-item-2-3</Label>
        </div>
      </FilterGroupWrapper>
    </FilterWrapper>
  );
};

const FilterClean = flow(
  designable(FilterByGroupComponentsStart),
)(Filter);

const asBodilessFilter = withDesign({
  FilterCategory: addClasses('font-bold'),
  FilterGroupItem: addClasses('mr-3'),
});

export default asBodilessFilter(FilterClean);
