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
import {
  WithNodeKeyProps,
  withSidecarNodes,
  withNode,
  withNodeKey,
  withChild,
  ifToggledOn,
} from '@bodiless/core';
import {
  withBreadcrumbStartingTrail,
  withoutBreadcrumbFinalTrail,
} from '@bodiless/navigation';
import {
  asToken,
  stylable,
  addClasses,
  addProps,
  withDesign,
  replaceWith,
  A,
  Ul,
  Span,
  Fragment,
} from '@bodiless/fclasses';

import {
  asBold,
  asEditableLink,
  asLink,
} from '../Elements.token';

const HomeBreadcrumbIcon = asToken(
  addProps({ children: 'home' }),
  addClasses('material-icons'),
)(Span);

const withStartingTrailIcon = (
  nodeKeys?: WithNodeKeyProps,
) => flow(
  withBreadcrumbStartingTrail,
  withDesign({
    StartingTrail: replaceWith(
      flow(
        withChild(HomeBreadcrumbIcon),
        withSidecarNodes(
          asEditableLink('link'),
        ),
        addProps({ href: '/' }),
        withNode,
        withNodeKey(nodeKeys),
      )(A),
    ),
  }),
);

const withNonLinkableItems = withDesign({
  Link: replaceWith(Fragment),
});

const withBoldedFinalTrail = withDesign({
  BreadcrumbItem: ifToggledOn(({ isCurrentPage }: any) => isCurrentPage)(asBold),
  FinalTrail: asBold,
});

const withHiddenCurrentPageItem = flow(
  withDesign({
    BreadcrumbItem: ifToggledOn(
      ({ isCurrentPage }: any) => isCurrentPage,
    )(replaceWith(() => <></>)),
  }),
  withoutBreadcrumbFinalTrail,
);

const withSeparator = (separator: string) => addProps({
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

const withStartingTrailLinkStyles = withDesign({
  StartingTrail: asLink,
});

const $withBreadcrumbStyles = asToken(
  withDesign({
    Separator: asToken(
      replaceWith(Span),
      addClasses('mx-1'),
    ),
    BreadcrumbWrapper: asToken(
      replaceWith(Ul),
      addClasses('inline-flex'),
    ),
    BreadcrumbItem: stylable,
    Link: asLink,
  }),
  withStartingTrailLinkStyles,
  withArrowSeparator,
);

export {
  $withBreadcrumbStyles,
  withStartingTrailIcon,
  withNonLinkableItems,
  withBoldedFinalTrail,
  withVerticalBarSeparator,
  withSlashSeparator,
  withHiddenCurrentPageItem,
  withStartingTrailLinkStyles,
};
