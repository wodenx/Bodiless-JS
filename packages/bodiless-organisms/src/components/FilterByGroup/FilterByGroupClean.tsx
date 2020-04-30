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
  designable, Div, Button, withoutProps, H3,
} from '@bodiless/fclasses';
import { usePageDimensionsContext } from '@bodiless/core';
import { observer } from 'mobx-react-lite';
import { ListAccordionTitle } from '@bodiless/components';
import { FilterByGroupComponents, FilterByGroupProps } from './types';
import FilterClean from './Filter';
import { useFilterByGroupContext, withFilterByGroupContext } from './FilterByGroupContext';

const FilterByGroupComponentsStart:FilterByGroupComponents = {
  Wrapper: Div,
  FilterWrapper: Div,
  FilterHeader: Div,
  FilterTitle: H3,
  ContentWrapper: Div,
  ResetButton: Button,
  Filter: FilterClean,
};

const FilterByGroupBase: FC<FilterByGroupProps> = ({
  components,
  children,
  resetButtonText = 'Reset',
  filterTitle = 'Filter',
  ...rest
}) => {
  const {
    Wrapper,
    FilterWrapper,
    FilterHeader,
    FilterTitle,
    ContentWrapper,
    ResetButton,
    Filter,
  } = components;

  const { size } = usePageDimensionsContext();
  const [expanded, setExpanded] = useState(size === 'lg');
  const { setSelectedTag } = useFilterByGroupContext();

  const isExpanded = size === 'lg' || expanded;

  return (
    <Wrapper {...rest}>
      <FilterWrapper>
        <FilterHeader>
          <ListAccordionTitle expanded={isExpanded} setExpanded={setExpanded}>
            <FilterTitle>{filterTitle}</FilterTitle>
          </ListAccordionTitle>
          <ResetButton className={isExpanded ? '' : 'hidden'} onClick={() => setSelectedTag()}>{resetButtonText}</ResetButton>
        </FilterHeader>
        <Div className={isExpanded ? 'block' : 'hidden'}>
          <Filter />
        </Div>
      </FilterWrapper>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};

const FilterByGroupClean = flow(
  observer,
  withoutProps(['suggestions']),
  withFilterByGroupContext,
  designable(FilterByGroupComponentsStart),
)(FilterByGroupBase);

export default FilterByGroupClean;
