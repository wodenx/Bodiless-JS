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
import { asToken, withDesign, addClasses } from '@bodiless/fclasses';
import { asBurgerMenu, withSubMenuToken, withColumnSubMenuDesign } from '@bodiless/navigation';

const $withBaseSubMenuStyles = withDesign({
  Item: addClasses('pl-4'),
});

const $withColumnSubMenuStyles = withColumnSubMenuDesign(
  withDesign({
    Item: addClasses('pl-8'),
  }),
);

const $withBurgerMenuStyles = asToken(
  asBurgerMenu('List', 'Columns', 'Touts'),
  withSubMenuToken('List', 'Columns', 'Touts')($withBaseSubMenuStyles),
  withSubMenuToken('Columns')($withColumnSubMenuStyles),
);

const $asSiteBurgerMenu = flow(
  withDesign({
    Menu: $withBurgerMenuStyles,
  }),
);

export default $asSiteBurgerMenu;
