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

import { flow, flowRight } from 'lodash';

import {
  withDesign, addClassesIf, withoutProps,
} from '@bodiless/fclasses';
import { withSidecarNodes, WithNodeKeyProps } from '@bodiless/core';
import {
  asBreadcrumb, useBreadcrumbContext, asBodilessList, asSubList,
  withDeleteNodeOnUnwrap, asChameleonSubList,
} from '@bodiless/components';
import { observer } from 'mobx-react-lite';

import { asDefaultMenuTout, asDefaultMenuLink } from './MenuTitles';
import asStylableList from '../MainMenu/asStylableList';
import asSubMenu from './asSubMenu';

// First we build a basic list with the correct data structure.

// Defines the basic sublist for all mubmenu types.
const asMenuSubList = flow(
  asSubList,
  asStylableList,
  withDeleteNodeOnUnwrap('sublist'),
  // @TODO: Should we be providing titles at all? It will almost always be overridden at site level.
  withDesign({
    Title: asDefaultMenuLink,
  }),
);

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
    Title: asDefaultMenuLink,
    Item: asChameleonSubList,
  }),
  withSubMenuDesign(asMenuSubList),
  withMenuDesign({
    Item: withoutProps(['addItem', 'deleteItem', 'canDelete']),
  }),
);

// Next we replace basic list elements with rc-menu elements to create a menu.

// Applies above designs to the chameilion sublist
const asChameleonSubMenu = withDesign({
  List: asSubMenu,
  Touts: flowRight(
    withDesign({
      Title: asDefaultMenuTout,
    }),
    asSubMenu,
  ),
  Columns: flowRight(
    withDesign({
      Item: asSubMenu,
    }),
    asSubMenu,
  ),
  _default: withoutProps(['addItem', 'deleteItem', 'canDelete']),
});

/**
 * HOC which can be applied to a base menu to make it into a sites main menu.
 *
 * @param A base menu component created via asMenuBase()
 *
 * @return A clean (unstyled) site main menu.
 */
const asMainMenuClean = flowRight(
  withDesign({
    Item: asChameleonSubMenu,
  }),
);

// Now we create breaccrumbs

/**
 * HOC which can be applied to a base menu to make it into a site's breadcrumbs
 *
 * @param A base menu component created via asMenuBase()
 *
 * @return A clean (unstyled) site breadcrumb component.
 */
const asBreadcrumbsClean = withMenuDesign({
  Item: withSidecarNodes(asBreadcrumb('title$component')),
  Title: flow(
    addClassesIf(() => !useBreadcrumbContext().isActive)('hidden'),
    observer,
  ),
});

// @TODO Add a similar HOC for BurgerMenu, something like:
// const asMegaMenuClean = withMenuDesign({
//   WrapperItem: asAccodionTitle,
//   List: asAccordionBody,
// });

export {
  asMenuSubList, asMenuBase, asMainMenuClean, withMenuDesign, asBreadcrumbsClean,
};
