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
  designable, Div, H3, Input, Label,
} from '@bodiless/fclasses';
import { FilterComponents, FilterProps } from './types';
import { useFilterByGroupContext } from './FilterByGroupProvider';

const FilterComponentsStart:FilterComponents = {
  FilterCategory: H3,
  FilterGroupWrapper: Div,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const FilterBase: FC<FilterProps> = ({ components }) => {
  const {
    FilterCategory,
    FilterGroupItem,
    FilterGroupWrapper,
    FilterInputWrapper,
  } = components;

  const { tags, selectedTag, updateSelectedTag } = useFilterByGroupContext();

  return (
    <React.Fragment>
      <FilterCategory>Filter Category</FilterCategory>
      <FilterGroupWrapper>
        {tags.map(tag => (
          <FilterInputWrapper key={tag.id}>
            <FilterGroupItem type="radio" name="filter-item" value={tag.name} id={tag.id} onChange={() => updateSelectedTag(tag.name)} checked={selectedTag === tag.name} />
            <Label htmlFor={tag.id}>{ tag.name }</Label>
          </FilterInputWrapper>
        ))}
      </FilterGroupWrapper>
    </React.Fragment>
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
