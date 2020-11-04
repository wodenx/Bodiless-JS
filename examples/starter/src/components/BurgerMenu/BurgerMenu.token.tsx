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
import { withDesign, addClasses, addProps } from '@bodiless/fclasses';

import { asDefaultLogoStyle } from '../Layout/token';

/**
 * Burger Menu Styles
 * ===========================================
 */
const withBurgerMenuStyles = withDesign({
  Wrapper: addClasses('bg-teal-600 py-1'),
  Header: flow(
    asDefaultLogoStyle,
    withDesign({ SiteReturn: addClasses('bg-teal-600') }),
  ),
  Menu: flow(
    addClasses('bg-gray-300'),
    addProps({ noOverlay: true, width: '100%', right: true }),
  ),
});

export default withBurgerMenuStyles;
