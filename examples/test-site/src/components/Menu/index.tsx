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

import { flow, pick } from 'lodash';
import { withDesign, replaceWith } from '@bodiless/fclasses';
import { withNode } from '@bodiless/core';
import { withResponsiveVariants } from '@bodiless/components';

import SimpleMenu from './SimpleMenu';
import MegaMenu from './MegaMenu';
import { SimpleBurgerMenu, MegaBurgerMenu } from '../BurgerMenu';
import { breakpoints as allBreakpoints } from '../Page';

const breakpoints = pick(allBreakpoints, 'lg');

const ResponsiveSimpleMenu = flow(
  withResponsiveVariants({ breakpoints }),
  withDesign({
    lg: replaceWith(SimpleMenu),
  }),
  withNode,
)(SimpleBurgerMenu);

const ResponsiveMegaMenu = flow(
  withResponsiveVariants({ breakpoints }),
  withDesign({
    lg: replaceWith(MegaMenu),
  }),
  withNode,
)(MegaBurgerMenu);

export {
  ResponsiveSimpleMenu,
  ResponsiveMegaMenu,
};
