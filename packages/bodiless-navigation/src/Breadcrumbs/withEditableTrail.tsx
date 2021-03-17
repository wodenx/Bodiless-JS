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
import {
  WithNodeKeyProps, withSidecarNodes, withNode, withNodeKey, asReadOnly,
} from '@bodiless/core';
import {
  Token, addProps, withDesign, replaceWith, A, Span, asToken, stylable,
} from '@bodiless/fclasses';
import { asEditable, asBodilessLink, withoutLinkWhenLinkDataEmpty } from '@bodiless/components';

import { withBreadcrumbStartingTrail, withBreadcrumbFinalTrail } from './Breadcrumbs';

const asEditableTrail = (
  nodeKeys?: WithNodeKeyProps,
  placeholder?: string,
) => asToken(
  replaceWith(A),
  asEditable('text', placeholder),
  withSidecarNodes(
    asBodilessLink('link'),
  ),
  withNode as Token,
  withNodeKey(nodeKeys),
);

const withDefaultNodeKeys = (defaultKey: string) => (nodeKeys?: WithNodeKeyProps) => (
  typeof nodeKeys === 'string'
    ? nodeKeys
    : { nodeKey: defaultKey, ...nodeKeys }
);

const withDefaultStartingTrailNodeKey = withDefaultNodeKeys('startingTrail');
const withDefaultFinalTrailNodeKey = withDefaultNodeKeys('finalTrail');

export const withEditableStartingTrail = (
  nodeKeys?: WithNodeKeyProps,
  placeholder: string = 'Enter item',
) => flow(
  withBreadcrumbStartingTrail,
  withDesign({
    StartingTrail: flow(
      asEditableTrail(withDefaultStartingTrailNodeKey(nodeKeys), placeholder),
      addProps({ children: 'Home', href: '/' }),
    ),
  }),
);

export const withEditableFinalTrail = (
  nodeKeys?: WithNodeKeyProps,
  placeholder: string = 'Enter item',
) => flow(
  withDesign({
    FinalTrail: asToken(
      replaceWith(Span),
      asEditableTrail(withDefaultFinalTrailNodeKey(nodeKeys), placeholder),
      // @todo add meta
    ),
  }),
  withBreadcrumbFinalTrail,
);

export const withBreadcrumbEditors = (withTitleEditors?: Token) => asToken(
  withTitleEditors,
  withDesign({
    Link: asToken(stylable, withoutLinkWhenLinkDataEmpty, asReadOnly),
    Title: asReadOnly,
  }),
);
