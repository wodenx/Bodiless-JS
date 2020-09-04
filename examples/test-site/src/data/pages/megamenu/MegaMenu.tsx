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

import { flow } from 'lodash';
import {
  asMenuLink, asStylableList,
} from '@bodiless/organisms';

import {
  withDesign, addClassesIf,
} from '@bodiless/fclasses';
import { withTitle } from '@bodiless/layouts';
import {
  EditButtonOptions, ifToggledOff, withSidecarNodes, EditButtonProps, ifToggledOn,
} from '@bodiless/core';
// import { withEditorSimple } from '../../../components/Editors';
import { asEditable, asBreadcrumb, useBreadcrumbContext } from '@bodiless/components';
import { observer } from 'mobx-react-lite';

import asBodilessChamelion, { ChamelionData } from './Chamelion';
import asMenuTout from './MenuTout';
import asMenu, { asSubMenu, asSubMenu$, asMenuItemGroup, usePlainLinks, asSubMenuList, asMenuItemGroup$ } from './asMenu';
import { asSubList } from './asBodilessList';

// Workaround for issue with multiple slate editors pointing to the same node.
const withEditorSimple = asEditable;

const asBasicSubMenuListClean = flow(
  asSubList,
  asStylableList,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
);

const asBasicSubMenuClean = asSubMenu$;

const asBasicSubMenuClean$ = flow(
  asBasicSubMenuListClean,
  ifToggledOff(usePlainLinks)(
    asBasicSubMenuClean,
  ),
);

const asToutSubMenuListClean = asBasicSubMenuListClean;

const asToutSubMenuClean = flow(
  asSubMenu$,
  withDesign({
    Title: asMenuTout(withEditorSimple),
  }),
);

const asToutsSubMenuClean$ = flow(
  asToutSubMenuListClean,
  ifToggledOff(usePlainLinks)(
    asToutSubMenuClean,
  ),
);

const asColumnListClean = asBasicSubMenuListClean;

const asColumnClean = asMenuItemGroup$;

const asColumnClean$ = flow(
  asColumnListClean,
  ifToggledOff(usePlainLinks)(
    asColumnClean,
  ),
);

const asColumnSubMenuClean = flow(
  asBasicSubMenuClean$,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asColumnClean$,
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

const asChamelionSubMenuClean = flow(
  asBodilessChamelion('cham-sublist', {}, useOverrides),
  withDesign({
    Basic: flow(asBasicSubMenuClean$, withTitle('Basic sub-menu')),
    Touts: flow(asToutsSubMenuClean$, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubMenuClean, withTitle('Column sub-menu')),
  }),
);

const asMenuClean = flow(
  asMenu(),
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asChamelionSubMenuClean,
  }),
);

const asBreadcrumbMenu = withDesign({
  Item: withSidecarNodes(asBreadcrumb('title$component')),
  Title: flow(
    addClassesIf(() => !useBreadcrumbContext().isActive)('hidden'),
    observer,
  ),
});

const asBreadcrumbs = flow(
  withDesign({
    Item: withDesign({
      Basic: asBreadcrumbMenu,
      Touts: asBreadcrumbMenu,
      Columns: flow(
        withDesign({
          Item: asBreadcrumbMenu,
        }),
        asBreadcrumbMenu,
      ),
    }),
  }),
  asBreadcrumbMenu,
);

export { asMenuClean, asBreadcrumbs };
