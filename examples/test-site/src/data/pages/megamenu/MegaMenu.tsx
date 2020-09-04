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
  EditButtonOptions, withSidecarNodes, EditButtonProps,
} from '@bodiless/core';
// import { withEditorSimple } from '../../../components/Editors';
import { asEditable, asBreadcrumb, useBreadcrumbContext } from '@bodiless/components';
import { observer } from 'mobx-react-lite';

import asBodilessChamelion, { ChamelionData } from './Chamelion';
import asMenuTout from './MenuTout';
import {
  asSubMenu, asMenuItemGroup, asMenu, withMenuItem,
} from './asMenu';
import asBodilessList, { asSubList } from './asBodilessList';

// Workaround for issue with multiple slate editors pointing to the same node.
const withEditorSimple = asEditable;

const asSubMenuList = flow(
  asSubList,
  asStylableList,
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
);

const asBasicSubMenuClean = flow(
  withMenuItem,
  asSubMenu,
);

const asToutSubMenuClean = flow(
  withMenuItem,
  asSubMenu,
  withDesign({
    Title: asMenuTout(withEditorSimple),
  }),
);

const asColumnSubMenuListClean = flow(
  asSubMenuList,
  withDesign({
    Item: asSubMenuList,
  }),
);

const asColumnSubMenuClean = flow(
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

const asChamelionSubMenuList = flow(
  asBodilessChamelion('cham-sublist', {}, useOverrides),
  withDesign({
    Basic: flow(asSubMenuList, withTitle('Basic sub-menu')),
    Touts: flow(asSubMenuList, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubMenuListClean, withTitle('Column sub-menu')),
  }),
);

const asChamelionSubMenuClean = withDesign({
  Basic: asBasicSubMenuClean,
  Touts: asToutSubMenuClean,
  Columns: asColumnSubMenuClean,
});

const asMenuBase = flow(
  asBodilessList(),
  asStylableList,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asChamelionSubMenuList,
  }),
);

const asMenuClean = flow(
  asMenu,
  withDesign({
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

export { asMenuBase, asMenuClean, asBreadcrumbs };
