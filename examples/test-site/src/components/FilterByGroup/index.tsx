/**
 * Copyright © 2019 Johnson & Johnson
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
import { FilterByGroupClean, asTestableFilterByGroup } from '@bodiless/organisms';
import { withDesign, addClasses } from '@bodiless/fclasses';
import { asTextColorPrimary } from '../Elements.token';

const asFilterByGroup = flow(
  withDesign({
    Wrapper: addClasses('p-2'),
    FilterWrapper: addClasses('mr-5'),
    ContentWrapper: addClasses('p-2'),
    ResetButton: flow(
      addClasses('mb-4 underline'),
      asTextColorPrimary
    ),
    Filter: addClasses('p-2'),
    FilterCategory: addClasses('font-bold'),
    FilterGroupItem: addClasses('mr-3'),
    FilterInputWrapper: addClasses('flex p-2 items-center'),
  }),
  asTestableFilterByGroup,
);

const FilterByGroup = asFilterByGroup(FilterByGroupClean);

export default FilterByGroup;
