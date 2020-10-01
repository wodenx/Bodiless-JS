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

import { asMenuLink } from '@bodiless/organisms';
import { addClasses, withDesign, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import { withTitle } from '@bodiless/layouts';
import { asBodilessChameleon } from '@bodiless/components';
import { withEditorSimple } from '../../../components/Editors';

const startWithMenuLink = flow(
  // startWith(withOnlyProps('key', 'children')(Fragment)),
  asMenuLink(withEditorSimple('text', 'Menu Link')),
  stylable,
);

const asRed = flow(
  startWithMenuLink,
  addClasses('text-red-500'),
  withTitle('Red Text'),
);

const asBlue = flow(
  startWithMenuLink,
  addClasses('text-blue-500'),
  withTitle('Blue Text'),
);

const asWhite = flow(
  startWithMenuLink,
  addClasses('text-white'),
  withTitle('White Text'),
);

const design = {
  Red: asRed,
  Blue: asBlue,
  White: asWhite,
};

const asChameleonTitle = flow(
  asBodilessChameleon('cham-component', { component: 'White' }),
  withDesign(design),
);

export default asChameleonTitle;
