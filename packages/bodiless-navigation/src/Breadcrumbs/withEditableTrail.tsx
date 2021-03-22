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
import { WithNodeKeyProps, withNodeKey } from '@bodiless/core';
import {
  Token, addProps, withDesign, asToken,
} from '@bodiless/fclasses';

import { withBreadcrumbStartingTrail, withBreadcrumbFinalTrail } from './Breadcrumbs';
import { asMenuTitle, withDefaultMenuTitleEditors } from '../Menu/MenuTitles';

const withDefaultNodeKeys = (defaultKey: string) => (nodeKeys?: WithNodeKeyProps) => (
  typeof nodeKeys === 'string'
    ? nodeKeys
    : { nodeKey: defaultKey, ...nodeKeys }
);

const withDefaultStartingTrailNodeKey = withDefaultNodeKeys('startingTrail');
const withDefaultFinalTrailNodeKey = withDefaultNodeKeys('finalTrail');

/**
 * Enables rendering of the starting trail for a Breadcrumb component with a provided Editors.
 * Uses `withDefaultMenuTitleEditors` by default, pre-configured with a link to the home page.
 *
 * @param withTitleEditors
 * Editors token that will be applied to the Title key of the StartingTrail component.
 *
 * @param nodeKeys
 * Optional nodeKeys of type `WithNodeKeyProps` that will be applied to the StartingTrail.
 *
 * @return
 * Token that adds starting trail with provided Title Editors and nodeKeys.
 */
export const withEditableStartingTrail = (
  withTitleEditors: Token = withDefaultMenuTitleEditors,
  nodeKeys?: WithNodeKeyProps,
) => flow(
  withBreadcrumbStartingTrail,
  withDesign({
    StartingTrail: asToken(
      asMenuTitle,
      withTitleEditors,
      addProps({ href: '/' }) as Token,
      withNodeKey(withDefaultStartingTrailNodeKey(nodeKeys)),
    ),
  }),
);

/**
 * Enables rendering of the final trail for a Breadcrumb component with a provided Editors.
 * Uses `withDefaultMenuTitleEditors` by default.
 *
 * @param withTitleEditors
 * Editors token that will be applied to the Title key of the FinalTrail component.
 *
 * @param nodeKeys
 * Optional nodeKeys of type `WithNodeKeyProps` that will be applied to the FinalTrail.
 *
 * @return
 * Token that adds final trail with provided Title Editors and nodeKeys.
 */
export const withEditableFinalTrail = (
  withTitleEditors: Token = withDefaultMenuTitleEditors,
  nodeKeys?: WithNodeKeyProps,
) => flow(
  withBreadcrumbFinalTrail,
  withDesign({
    FinalTrail: asToken(
      asMenuTitle,
      withTitleEditors,
      withNodeKey(withDefaultFinalTrailNodeKey(nodeKeys)),
    ),
  }),
);
