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

import React, { HTMLProps } from 'react';
import { flow } from 'lodash';
import { withSidecarNodes, asReadOnly} from '@bodiless/core';
import { asEditable, asBodilessLink } from '@bodiless/components'; 
import {
  addClasses,
  addProps,
  withDesign,
  replaceWith,
  A,
  Span,
  withOnlyProps,
} from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  asSimpleMenuBreadcrumbs,
} from '@bodiless/organisms';

import { asBold } from '../Elements.token'; 
import { EditorSimple } from '../Editors';

const STARTING_TRAIL_NODE_KEY = 'startingTrail';
const FINAL_TRAIL_NODE_KEY = 'finalTrail';

const withSeparator = (separator: string) => addProps({
  children: separator,
});

const withMenuBreadcrumbSchema = withDesign({
  Separator: replaceWith(Span),
  BreadcrumbLink: flow(
    replaceWith(
      withSidecarNodes(
        asBodilessLink(),
      )(A)
    ),
    asReadOnly,
  ),
  BreadcrumbTitle: flow(
    replaceWith(EditorSimple),
    asReadOnly,
  ),
});

const withMenuBreadcrumbsStyles = withDesign({
  Separator: flow(
    withSeparator('>'),
    addClasses('mx-1'),
  ),
  BreadcrumbWrapper: addClasses('inline-flex'),
});

const MenuBreadcrumbs = flow(
  asSimpleMenuBase(),
  asSimpleMenuBreadcrumbs({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  withMenuBreadcrumbSchema,
  withMenuBreadcrumbsStyles,
)('ul');

const withEditableStartingTrail = withDesign({
  StartingTrail: asEditable(STARTING_TRAIL_NODE_KEY, 'Enter Item'),
});

const withStartingTrailIcon = withDesign({
  StartingTrail: flow(
    replaceWith((props: HTMLProps<HTMLSpanElement>) => <Span {...props}>home</Span>),
    addClasses('material-icons'),
  ),
});

const withNonLinkableItems = withDesign({
  BreadcrumbLink: flow(
    replaceWith(React.Fragment),
    withOnlyProps('key', 'children'),    
  ),
});

const withEditableFinalTrail = withDesign({
  FinalTrail: flow(
    replaceWith(Span),
    asEditable(FINAL_TRAIL_NODE_KEY, 'Enter Item')
  ),
});

const withBoldedFinalTrail = withDesign({
  FinalTrail: asBold,
});

const withVerticalBarSeparator = withDesign({
  Separator: withSeparator('|'),
});

const withSlashSeparator = withDesign({
  Separator: withSeparator('/'),
});

export {
  MenuBreadcrumbs,
  withEditableStartingTrail,
  withStartingTrailIcon,
  withNonLinkableItems,
  withEditableFinalTrail,
  withBoldedFinalTrail,
  withVerticalBarSeparator,
  withSlashSeparator,
};
