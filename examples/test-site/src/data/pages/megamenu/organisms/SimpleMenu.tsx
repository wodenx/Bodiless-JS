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

import { flow, identity } from 'lodash';
import { asStylableList } from '@bodiless/organisms';


import {
  withDesign, addClassesIf,
} from '@bodiless/fclasses';
import {
  withSidecarNodes, WithNodeKeyProps,
} from '@bodiless/core';
import {
  asBreadcrumb, useBreadcrumbContext,
  useBodilessToggle, withBodilessToggleButton, ifBodilessTogggleOn,
} from '@bodiless/components';
import { observer } from 'mobx-react-lite';

import { asSubMenu, asMenu, withMenuItem } from './asMenu';
import asBodilessList, { asSubList } from './components/asBodilessList';
import { asMenuLInk } from './MegaMenuTitles';

const TOGGLE_NODE_KEY = 'toggle-sublist';
const ifSublist = ifBodilessTogggleOn(TOGGLE_NODE_KEY);

// Defines the basic sublist for all mubmenu types.
// const asMenuSubList = flow(
//   asSubList,
//   asStylableList,
//   withDesign({
//     Title: asDefaultMenuLink,
//   }),
// );

// Provides overrides for the chamelion button
const useOverrides = (props: any): any => {
  const on = useBodilessToggle(props);
  return {
    icon: 'playlist_add',
    isHidden: on,
    label: 'Sub',
  };
};

// Defines the sublist type for the top level menu items.
const asToggledSubList = flow(
  withBodilessToggleButton(TOGGLE_NODE_KEY, undefined, useOverrides),
  // ifSublist(
  //   asMenuSubList,
  // ),
);

/**
 * Bodiless HOC generator which creates the basic structure of the Menu. The component
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
    Title: asMenuLink(() => identity),
    Item: asToggledSubList,
  }),
);

/**
 * HOC which can be applied to a base menu to make it into a sites main menu.
 *
 * @param A base menu component created via asMenuBase()
 *
 * @return A clean (unstyled) site main menu.
 */
const asMainMenuClean = flow(
  asMenu,
  withDesign({
    Item: flow(
      ifSublist(asSubMenu),
      withMenuItem,
    ),
  }),
);

/**
 * Applies a list design (or other HOC) to the main menu and all submenus.
 *
 * @param design The design object or HOC to be applied.
*/
const withMenuDesign = (design: any) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return flow(
    withDesign({
      Item: ifSublist(withDesign$),
    }),
    withDesign$,
  );
};

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
  asMenuBase, asMainMenuClean, withMenuDesign, asBreadcrumbsClean,
};
