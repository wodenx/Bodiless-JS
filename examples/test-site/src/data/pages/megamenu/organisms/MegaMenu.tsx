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
import { asDefaultMenuTout } from './MegaMenuTitles';
import {
  asSubMenu, asMenuItemGroup, asMenu, withMenuItem,
} from './asMenu';
import asBodilessList, { asSubList as asBodilessSubList } from './components/asBodilessList';

const asSubList = flow(
  asBodilessSubList,
  asStylableList,
  withDesign({
    Title: asMenuLink(() => identity),
  }),
);

const asBasicSubMenu = flow(
  withMenuItem,
  asSubMenu,
);

const asToutSubMenu = flow(
  withMenuItem,
  asSubMenu,
  withDesign({
    Title: asDefaultMenuTout,
  }),
);

const asColumnSubList = flow(
  asSubList,
  withDesign({
    Item: asSubList,
  }),
);

const asColumnSubMenu = flow(
  asSubMenu,
  withDesign({
    Item: asMenuItemGroup,
  }),
);

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

const asChamelionSubList = flow(
  asBodilessChamelion('cham-sublist', {}, useOverrides),
  withDesign({
    Basic: flow(asSubList, withTitle('Basic sub-menu')),
    Touts: flow(asSubList, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubList, withTitle('Column sub-menu')),
  }),
);

const asChamelionSubMenu = withDesign({
  Basic: asBasicSubMenu,
  Touts: asToutSubMenu,
  Columns: asColumnSubMenu,
});

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

export {
  asMenuBase, asMainMenuClean, withMenuDesign, asBreadcrumbsClean,
};
