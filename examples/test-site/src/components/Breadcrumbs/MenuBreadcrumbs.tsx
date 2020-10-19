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
import { asEditable, asBodilessLink } from '@bodiless/components'; 
import {
  addClasses,
  addProps,
  withDesign,
  replaceWith,
  A,
} from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  asMenuLink,
  asSimpleMenuBreadcrumbs,
  withMenuBreadcrumbDesign,
  withSimpleMenuDesign,
  asBreadcrumbListItem,
  withBreadcrumb,
} from '@bodiless/organisms';

import { EditorSimple } from '../Editors';

const STARTING_TRAIL_NODE_KEY = 'startingTrail';

const MenuBreadcrumbs = flow(
  asSimpleMenuBase(),
  asSimpleMenuBreadcrumbs,
  withBreadcrumb,
  withDesign({
    StartingTrail: addProps({ label: 'starting-trail' }),
    Separator: flow(
      replaceWith(() => <span className="mx-1">{'>'}</span>),
      addClasses('separator'),
    ),
    BreadcrumbWrapper: addClasses('inline-flex'),
    BreadcrumbItem: addProps({ label: 'item' }),
    BreadcrumbLink: flow(
      replaceWith(
        flow(
          withSidecarNodes(
            asBodilessLink(),
          ),
        )(A),
      ),
    ),
    BreadcrumbTitle: flow(
      replaceWith(EditorSimple),
    ),
    FinalTrail: addProps({ label: 'final-trail' }),
  }),
)('ul');

const withEditableStartingTrail = withDesign({
  StartingTrail: asEditable(STARTING_TRAIL_NODE_KEY, 'Enter Item'),
});

export {
  MenuBreadcrumbs,
  withEditableStartingTrail,
};
