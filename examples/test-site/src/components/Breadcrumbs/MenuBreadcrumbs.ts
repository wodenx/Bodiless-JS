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

import {
  BreadcrumbsClean,
  asMenuBreadcrumbs,
  withEditableStartingTrail,
  withEditableFinalTrail,
  withMenuBreadcrumbSchema as withDefaultBreadcrumbSchema,
} from '@bodiless/navigation';
import { asToken } from '@bodiless/fclasses';

import { withMenuBreadcrumbStyles } from './MenuBreadcrumbs.token';

const DEFAULT_STARTING_TRAIL_NODE_KEY = 'startingTrail';
const DEFAULT_FINAL_TRAIL_NODE_KEY = 'finalTrail';

const withMenuBreadcrumbSchema = asToken(
  withDefaultBreadcrumbSchema,
  withEditableStartingTrail({
    nodeKey: DEFAULT_STARTING_TRAIL_NODE_KEY,
    nodeCollection: 'site',
  }, 'Enter item'),
  withEditableFinalTrail(DEFAULT_FINAL_TRAIL_NODE_KEY, 'Enter item'),
);

const Breadcrumbs = asToken(
  asMenuBreadcrumbs,
  withMenuBreadcrumbSchema,
  withMenuBreadcrumbStyles,
)(BreadcrumbsClean);

export default Breadcrumbs;
export {
  DEFAULT_STARTING_TRAIL_NODE_KEY,
  DEFAULT_FINAL_TRAIL_NODE_KEY,
};
