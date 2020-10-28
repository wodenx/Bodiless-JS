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
import { withSidecarNodes, asReadOnly } from '@bodiless/core';
import { asBodilessLink } from '@bodiless/components';
import {
  addClasses,
  withDesign,
  replaceWith,
  A,
  Span,
  Ul,
} from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  asSimpleMenuBreadcrumbs,
  asMegaMenuBreadcrumbs,
  asMegaMenuBase,
} from '@bodiless/organisms';

import { EditorSimple } from '../Editors';

import { withArrowSeparator } from './MenuBreadcrumbs.token';

const withMenuBreadcrumbSchema = withDesign({
  BreadcrumbLink: flow(
    replaceWith(
      withSidecarNodes(
        asBodilessLink(),
      )(A),
    ),
    asReadOnly,
  ),
  BreadcrumbTitle: replaceWith(EditorSimple),
});

const withMenuBreadcrumbsStyles = flow(
  withDesign({
    Separator: flow(
      replaceWith(Span),
      addClasses('mx-1'),
    ),
    BreadcrumbWrapper: flow(
      replaceWith(Ul),
      addClasses('inline-flex'),
    ),
  }),
  withArrowSeparator,
);

const Breadcrumbs = flow(
  asSimpleMenuBase(),
  asSimpleMenuBreadcrumbs({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  withMenuBreadcrumbSchema,
  withMenuBreadcrumbsStyles,
)('ul');

const MegaMenuBreadcrumbs = flow(
  asMegaMenuBase(),
  asMegaMenuBreadcrumbs({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  withMenuBreadcrumbSchema,
  withMenuBreadcrumbsStyles,
)('ul');

export default Breadcrumbs;
export { MegaMenuBreadcrumbs };
