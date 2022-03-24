/**
 * Copyright © 2022 Johnson & Johnson
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

import { withChild } from '@bodiless/core';
import { asMenuTogglerToken } from '../MenuTogglerClean';
import BurgerIcon from '../assets/BurgerIcon';
import CloseIcon from '../assets/CloseIcon';

/**
 * Token that defines the Default Menu Toggler, with burger icon.
 */
const Default = asMenuTogglerToken({
  Components: {
    Button: withChild(BurgerIcon),
  },
  Layout: {
    Wrapper: 'flex m-4 lg:hidden',
    Button: 'w-6 h-6 flex justify-center items-center',
  },
});

/**
 * Token that defines the Menu Toggler with close icon.
 */
const Close = asMenuTogglerToken({
  ...Default,
  Components: {
    Button: withChild(CloseIcon),
  },
  Layout: {
    ...Default.Layout,
    Wrapper: 'flex justify-end mx-4 my-6',
  },
});

export default {
  Default,
  Close,
};
