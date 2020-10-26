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
import type { WithNodeKeyProps } from '@bodiless/core';
import {
  withBreadcrumbStartingTrail,
  withBreadcrumbFinalTrail,
} from '@bodiless/components';
import {
  addClasses,
  addProps,
  withDesign,
  replaceWith,
  Span,
  withOnlyProps,
} from '@bodiless/fclasses';

import { asBold, asEditable } from '../Elements.token';

const withEditableStartingTrail = (
  nodeKeys?: WithNodeKeyProps,
  placeholder?: string,
) => flow(
  withBreadcrumbStartingTrail,
  withDesign({
    StartingTrail: asEditable(nodeKeys, placeholder),
  }),
);

const withStartingTrailIcon = flow(
  withBreadcrumbStartingTrail,
  withDesign({
    StartingTrail: flow(
      replaceWith((props: HTMLProps<HTMLSpanElement>) => <Span {...props}>home</Span>),
      addClasses('material-icons'),
    ),
  }),
);

const withNonLinkableItems = withDesign({
  BreadcrumbLink: flow(
    replaceWith(React.Fragment),
    withOnlyProps('key', 'children'),
  ),
});

const withEditableFinalTrail = (
  nodeKeys?: WithNodeKeyProps,
  placeholder?: string,
) => flow(
  withDesign({
    FinalTrail: flow(
      replaceWith(Span),
      asEditable(nodeKeys, placeholder),
    ),
  }),
  withBreadcrumbFinalTrail,
);

const withBoldedFinalTrail = withDesign({
  FinalTrail: asBold,
});

export const withSeparator = (separator: string) => addProps({
  children: separator,
});

const withArrowSeparator = withDesign({
  Separator: withSeparator('>'),
});

const withVerticalBarSeparator = withDesign({
  Separator: withSeparator('|'),
});

const withSlashSeparator = withDesign({
  Separator: withSeparator('/'),
});

export {
  withEditableStartingTrail,
  withStartingTrailIcon,
  withNonLinkableItems,
  withEditableFinalTrail,
  withBoldedFinalTrail,
  withArrowSeparator,
  withVerticalBarSeparator,
  withSlashSeparator,
};
