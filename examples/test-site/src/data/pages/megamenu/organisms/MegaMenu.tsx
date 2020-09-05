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
import {
  asMenuLink, asStylableList,
} from '@bodiless/organisms';

import {
  withDesign, addClassesIf,
} from '@bodiless/fclasses';
import { withTitle } from '@bodiless/layouts';
import {
  EditButtonOptions, withSidecarNodes, EditButtonProps, WithNodeKeyProps,
} from '@bodiless/core';
import { asBreadcrumb, useBreadcrumbContext } from '@bodiless/components';
import { observer } from 'mobx-react-lite';

import asBodilessChamelion, { ChamelionData } from './components/Chamelion';
import { asDefaultMenuTout, asDefaultMenuLink } from './MegaMenuTitles';
import {
  asSubMenu, asMenuItemGroup, asMenu, withMenuItem,
} from './asMenu';
import asBodilessList, { asSubList as asBodilessSubList } from './components/asBodilessList';

// Defines the basic sublist for all mubmenu types.
const asMenuSubList = flow(
  asBodilessSubList,
  asStylableList,
  withDesign({
    Title: asDefaultMenuLink,
  }),
);

// Provides overrides for the chamelion button
type Overrides = Partial<EditButtonOptions<any, ChamelionData>>;
const useOverrides = (props: EditButtonProps<ChamelionData>): Overrides => {
  const { componentData } = props;
  const { component } = componentData;
  return {
    // Commented lines hide the button rather than turning it into a swap button.
    // isHidden: Boolean(component),
    // icon: 'playlist_add',
    icon: component ? 'repeat' : 'playlist_add',
    label: 'Sub',
  };
};

// Defines the sublist type for the top level menu items.
const asChamelionSubList = flow(
  asBodilessChamelion('cham-sublist', {}, useOverrides),
  withDesign({
    Basic: flow(
      withTitle('Basic sub-menu'),
      asMenuSubList,
    ),
    Touts: flow(
      withTitle('Tout sub-menu'),
      asMenuSubList,
    ),
    Columns: flow(
      withTitle('Column sub-menu'),
      asMenuSubList,
      withDesign({
        Item: asMenuSubList,
      }),
    ),
  }),
);

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
    Title: asMenuLink(() => identity),
    Item: asChamelionSubList,
  }),
);

// Defines basic sub menu when displayed as main menu
const asBasicSubMenu = flow(
  asSubMenu,
  withMenuItem,
);

// Defines tout sub menu when displayed as main menu
const asToutSubMenu = flow(
  asBasicSubMenu,
  withDesign({
    Title: asDefaultMenuTout,
  }),
);

// Defines column sub menu when displayed as main menu
const asColumnSubMenu = flow(
  // We need to omit `withMenuItem` here bc it replaces the item and thus removes the sublist.
  asSubMenu,
  withDesign({
    Item: asMenuItemGroup,
  }),
);

// Applies above designs to the chameilion sublist
const asChamelionSubMenu = withDesign({
  Basic: asBasicSubMenu,
  Touts: asToutSubMenu,
  Columns: asColumnSubMenu,
});

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
    Item: asChamelionSubMenu,
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
      Item: withDesign({
        Basic: withDesign$,
        Touts: withDesign$,
        Columns: flow(
          withDesign({
            Item: withDesign$,
          }),
          withDesign$,
        ),
      }),
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
