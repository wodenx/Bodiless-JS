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

import { Fragment } from 'react';
import { flow } from 'lodash';
import {
  asHorizontalMenu,
  asHorizontalSubMenu,
  asMenuLink,
  asStylableList,
} from '@bodiless/organisms';

import {
  withDesign, addClasses, addProps, addClassesIf,
} from '@bodiless/fclasses';
import { withTitle } from '@bodiless/layouts';
import {
  EditButtonOptions, ifToggledOff, ifToggledOn, withSidecarNodes,
} from '@bodiless/core';
// import { withEditorSimple } from '../../../components/Editors';
import { asEditable, asBreadcrumb, useBreadcrumbContext } from '@bodiless/components';
import { asExceptMobile } from '../../../components/Elements.token';

import { withMenuListStyles, withMenuSublistStyles } from '../../../components/Menus/token';
import asBodilessChamelion, { ChamelionData } from './Chamelion';
import asMenuTout from './MenuTout';
import asMenu, { asSubMenu, asMenuItemGroup, usePlainLinks } from './asMenu';
import asBodilessList, { asSubList } from './asBodilessList';

// Workaround for issue with multiple slate editors pointing to the same node.
const withEditorSimple = asEditable;

const withMegaMenuStyles = withDesign({
  Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
  Item: addClasses('w-1/3'),
});

const asToggledMenu = (asMenuType: any) => flow(
  ifToggledOn(usePlainLinks)(
    asStylableList,
    asSubList,
  ),
  ifToggledOff(usePlainLinks)(
    asMenuType,
  ),
);

const asColumnClean = flow(
  asToggledMenu(asMenuItemGroup),
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
);

const withColumnStyles = flow(
  withMenuSublistStyles,
);

const asBasicSubMenuClean = flow(
  asToggledMenu(asSubMenu),
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
);

const withBasicSubMenuStyles = flow(
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const asToutSubMenuClean = flow(
  asBasicSubMenuClean,
  withDesign({
    Title: flow(
      ifToggledOff(usePlainLinks)(
        asMenuTout(withEditorSimple),
      ),
    ),
  }),
);

const withToutSubMenuStyles = flow(
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

const asColumnSubMenuClean = flow(
  asBasicSubMenuClean,
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asColumnClean,
  }),
);

const withColumnSubMenuStyles = flow(
  withDesign({
    Item: withColumnStyles,
  }),
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

type NodeDataHandlers<D> = {
  setComponentData: (data: D) => void,
  componentData: D,
};

type Overrides = Partial<EditButtonOptions<NodeDataHandlers<ChamelionData>, ChamelionData>>;

const useOverrides = (props: NodeDataHandlers<ChamelionData>): Overrides => {
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
    Basic: flow(asBasicSubMenuClean, withTitle('Basic sub-menu')),
    Touts: flow(asToutSubMenuClean, withTitle('Tout sub-menu')),
    Columns: flow(asColumnSubMenuClean, withTitle('Column sub-menu')),
  }),
);

const withChamelionSubMenuStyles = withDesign({
  Basic: withBasicSubMenuStyles,
  Touts: withToutSubMenuStyles,
  Columns: withColumnSubMenuStyles,
});

const asMenuClean = flow(
  ifToggledOff(usePlainLinks)(
    asMenu(),
  ),
  ifToggledOn(usePlainLinks)(
    asBodilessList(),
    asStylableList,
  ),
  withDesign({
    Title: asMenuLink(withEditorSimple),
    Item: asChamelionSubMenuClean,
  }),
);

const withMenuStyles = flow(
  withDesign({
    Item: withChamelionSubMenuStyles,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
);

const asBreadcrumbMenu = withDesign({
  Item: withSidecarNodes(asBreadcrumb('title$component')),
  Title: addClassesIf(() => !useBreadcrumbContext().isActive)('hidden'),
});

export const asBreadcrumbs = flow(
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

const Menu = flow(
  asMenuClean,
  withMenuStyles,
)(Fragment);

export default Menu;
export { asMenuClean, withMenuStyles };
