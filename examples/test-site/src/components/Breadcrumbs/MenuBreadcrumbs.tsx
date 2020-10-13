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

import React from 'react';
import { flow } from 'lodash';
import { asReadOnly, withSidecarNodes} from '@bodiless/core';
import { asEditable } from '@bodiless/components'; 
import {
  addClasses,
  addProps,
  withDesign,
  replaceWith,
  Span,
  Li,
} from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  asMenuLink,
  asSimpleMenuBreadcrumbs,
  withMenuBreadcrumbDesign,
  withSimpleMenuDesign,
  asBreadcrumbListItem,
} from '@bodiless/organisms';

import { withTitleEditor } from '../MegaMenu/MegaMenu';

const STARTING_TRAIL_NODE_KEY = 'startingTrail';

const MenuBreadcrumbs = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asSimpleMenuBreadcrumbs('title$link'),
  withSimpleMenuDesign({
    Wrapper: addClasses('inline-flex'),
  }),
  withMenuBreadcrumbDesign({
    Item: flow(
      addClasses('inline'),
      asReadOnly,
    ),
    Title: addClasses('test-title'),
    Separator: flow(
      replaceWith(() => <span className="mx-1">{'>'}</span>),
      addClasses('separator'),
    ),
    FinalTrail: withDesign({
      Item: addProps({ label: 'final' }),
    }),
  }),
)('ul');

const withEditableStartingTrail = withMenuBreadcrumbDesign({
  StartingTrail: withDesign({
     Item: replaceWith(
      withSidecarNodes(
        asEditable(STARTING_TRAIL_NODE_KEY, 'Enter Item'),
      )(Span),
    ),
  }),
});

export {
  MenuBreadcrumbs,
  withEditableStartingTrail,
};
