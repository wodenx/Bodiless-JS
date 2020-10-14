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
import { withDesign, addClasses } from '@bodiless/fclasses';

// import {
//   asAccordionWrapper,
//   asAccodionTitle,
//   asAccordionBody,
// } from '../Accordion';

// import { withMenuDesign } from './SimpleMenu';

const asBurgerMenuTitle = withDesign({
  Item: addClasses('ACCORDION_WRAPPER'),
  Title: addClasses('ACCORDION_TITLE'),
});

const withBurgerMenuBody = withDesign({
  Item: withDesign({
    SubMenu: withDesign({
      Wrapper: withDesign({
        List: addClasses('ACCORDION_BODY'),
      }),
    }),
  }),
});

const asBurgerMenuClean = flow(
  asBurgerMenuTitle,
  withBurgerMenuBody,
);

export default asBurgerMenuClean;
export {
  asBurgerMenuClean,
};
