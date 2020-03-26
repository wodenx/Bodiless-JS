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
import { designable, Div, A } from '@bodiless/fclasses';
import Filter from './Filter';
import { FilterByGroupComponents, FilterByGroupProps } from './types';

const FilterByGroupComponentsStart:FilterByGroupComponents = {
  Wrapper: Div,
  FilterWrapper: Div,
  ContentWrapper: Div,
  ResetButton: A,
  Filter: Filter,
};

const FilterByGroupBase: FC<FilterByGroupProps> = ({ components, children }) => {
  const {
    Wrapper,
    FilterWrapper,
    ContentWrapper,
    ResetButton,
    Filter,
  } = components;

  return (
    <Wrapper>
      <FilterWrapper>
        <ResetButton />
        <Filter />
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
