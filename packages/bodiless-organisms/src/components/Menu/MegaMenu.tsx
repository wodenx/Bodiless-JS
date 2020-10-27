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
  withDesign,
  replaceWith,
  withOnlyProps,
} from '@bodiless/fclasses';
import { WithNodeKeyProps } from '@bodiless/core';
import {
  asBreadcrumb, withBreadcrumb, withSubListDesign,
  asBodilessList, asChameleonSubList,
} from '@bodiless/components';
import type { BreadcrumbSettings } from '@bodiless/components';

import { asMenuSubList } from './SimpleMenu';
import asStylableList from './asStylableList';
import withMenuContext from './withMenuContext';

/**
 * Applies a list design (or other HOC) recursively to all submenus.
 *
 * @param design The design object or HOC to be applied.
*/
const withSubMenuDesign = (design: any) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return withDesign({
    Item: withDesign({
      List: withDesign$,
      Touts: withDesign$,
      Columns: flow(
        withDesign$,
        withDesign({
          Item: withDesign$,
        }),
      ),
    }),
  });
};

/**
 * Applies a list design (or other HOC) to the main menu and all submenus.
 *
 * @param design The design object or HOC to be applied.
*/
const withMenuDesign = (design: any) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return flow(
    withSubMenuDesign(withDesign$),
    withDesign$,
  );
};

/**
 * Bodiless HOC generator which creates the basic structure of the Mega Menu. The component
 * to which the HOC applies is irrelevant (it will be replaced by the Menu wrapper).
 *
 * The base mega menu serves as a base for various views on the Menu data, including
 * a site's main menu, a burger menu and breadcrumbs.
 *
 * @param nodeKeys The optional nodekeys specifying where the data should be stored.
 *
 * @return HOC which creates a basic mega menu list.
 */
const asMenuBase = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDesign({
    Item: asChameleonSubList,
  }),
  withSubMenuDesign(asMenuSubList),
  withMenuContext,
);

// Now we create breadcrumbs

/**
 * HOC that can be applied to a mage menu based component
 * it renders all list and sublist items
 * but produces no markup
 */
const withEmptyMenuMarkup = flow(
  withSubMenuDesign({
    Item: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
  }),
  withMenuDesign({
    Wrapper: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
  }),
  withSubListDesign(1)({
    _default: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
  }),
);

/**
 * HOC which can be applied to a base menu to make it into a site's breadcrumbs
 *
 * @param A base menu component created via asMenuBase()
 *
 * @return A clean (unstyled) site breadcrumb component.
 */
const asBreadcrumbsClean = (settings: BreadcrumbSettings) => flow(
  withEmptyMenuMarkup,
  withMenuDesign({
    Item: flow(
      asBreadcrumb(settings),
    ),
  }),
  withBreadcrumb,
);

// @TODO Add a similar HOC for BurgerMenu, something like:
// const asMegaMenuClean = withMenuDesign({
//   WrapperItem: asAccodionTitle,
//   List: asAccordionBody,
// });

export {
  asMenuSubList, asMenuBase, withMenuDesign,
  asBreadcrumbsClean,
};
