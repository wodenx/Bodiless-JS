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

import { flow } from 'lodash';
import { FilterByGroupClean, asTestableFilterByGroup, withFBGSuggestions } from '@bodiless/organisms';
import {
  withDesign,
  addClasses,
  addProps,
} from '@bodiless/fclasses';
import { asTextColorPrimary } from '../Elements.token';

const suggestions = [
  { id: '1', name: 'DefaultTag 1' },
  { id: '2', name: 'DefaultTag 2' },
  { id: '3', name: 'DefaultTag 3' },
  { id: '4', name: 'DefaultTag 4' },
];

const withTagListStyles = withDesign({
  Title: flow(
    addProps({ emptyTitleText: 'Group' }),
    withDesign({
      FilterInputWrapper: addClasses('flex pb-2 items-center'),
      FilterGroupItemInput: addClasses('mr-3'),
      FilterGroupItemPlaceholder: addClasses('text-gray-600'),
      FilterGroupItemLabel: addClasses(''),
    }),
  ),
  Wrapper: addClasses('m-2 pl-2'),
});

const withCategoryList = withDesign({
  Title: addClasses('font-bold'),
});

const asResponsiveFilterByGroup = withDesign({
  Wrapper: addClasses('lg:flex-row'),
  FilterWrapper: addClasses('md:w-1/3 lg:mr-5'),
  FilterHeader: addClasses('lg:flex-row lg:justify-between lg:items-center lg:w-full'),
});

const asFilterByGroup = flow(
  withFBGSuggestions({ suggestions }),
  addProps({ resetButtonText: 'Show All Products' }),
  asResponsiveFilterByGroup,
  withDesign({
    Wrapper: addClasses('flex flex-col'),
    FilterWrapper: addClasses('p-2 bg-gray-400 flex flex-col'),
    FilterHeader: addClasses('flex flex-col'),
    FilterTitle: addClasses('my-2 text-xl font-bold'),
    ContentWrapper: addClasses('p-2 w-full'),
    ResetButton: flow(
      addClasses('my-2 underline self-start'),
      asTextColorPrimary,
    ),
    Filter: withDesign({
      TagList: withTagListStyles,
      CategoryList: withCategoryList,
    }),
  }),
  asTestableFilterByGroup,
);

const FilterByGroup = asFilterByGroup(FilterByGroupClean);

export default FilterByGroup;
export {
  ContextLogger,
} from './ContextLogger';
