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
  withDesign, replaceWith, H2, addClasses, stylable, Li,
} from '@bodiless/fclasses';
import {
  asMenuTout, asMegaMenuBase, withMegaMenuDesign, asMegaMenuBreadcrumbs,
  asMenuLink, asMegaMenuTopNav,
} from '@bodiless/organisms';
import { asReadOnly } from '@bodiless/core';
import { withEditorSimple } from '../Editors';
import withMegaMenuStyles, { withMenuToutStyles } from './MegaMenu.token';
import { withToutEditors } from '../Tout';

export const withTitleEditor = withEditorSimple('text', 'Menu Item');

// Customize the tout editors so the node keys match
const withMenuToutEditors = flow(
  withToutEditors,
  withDesign({
    Title: flow(
      replaceWith(H2),
      // We set the title editor to match the one in asMenuLink
      withEditorSimple('text', 'Title'),
    ),
  }),
);

const asMenuTout$ = flow(
  asMenuTout(withMenuToutEditors),
  withMenuToutStyles,
);

const asMegaMenuBase$ = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
);

const MegaMenu = flow(
  asMegaMenuBase$,
  withDesign({
    Item: withDesign({
      Touts: withDesign({
        Title: asMenuTout$,
      }),
    }),
  }),
  withMegaMenuStyles,
  asMegaMenuTopNav,
)('ul');

const MegaMenuList = flow(
  asMegaMenuBase$,
  withMegaMenuDesign({
    Item: addClasses('pl-5'),
  }),
  asReadOnly,
)('ul');

export default MegaMenu;
export { MegaMenuList };
