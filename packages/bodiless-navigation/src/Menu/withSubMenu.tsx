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
  HOC, Design, withDesign, asToken,
} from '@bodiless/fclasses';
import {
  asStylableList, asStylableSubList, asSubList, withDeleteNodeOnUnwrap,
  withSubLists, UseListOverrides,
} from '@bodiless/components';

import { asBreadcrumbSource, asMenuTitle, asMenuTout } from './MenuTitles';

/**
 * Creates a stylable sublist which deletes it's data when the last item is removed.
 * Suitable for use for all menus.
 *
 * @param titleDesign optional token which will be applied to the sublist title.
 * @param useOverrides optional hook returning overrides for the submenu button.
 */
const asMenuSubList = (titleDesign: any = {}, useOverrides: UseListOverrides = () => ({})) => {
  const titleDesign$ = typeof titleDesign === 'function' ? titleDesign : withDesign(titleDesign);
  return flow(
    asSubList((props) => ({ groupLabel: 'Sub-Menu Item', ...useOverrides(props) })),
    asStylableList,
    asStylableSubList,
    withDeleteNodeOnUnwrap('sublist'),
    asBreadcrumbSource,
    withDesign({
      Title: titleDesign$,
    }),
  );
};

const withSubMenuDesign = (design: Design<any>) => withDesign({
  Item: withDesign(design),
});

/**
 * Helper which can be used to add a List submenu option to the menu.
 *
 * @param titleDesign? optional token which will be applied to the sublist title.
 *
 */
const withListSubMenu = (titleDesign: HOC = asMenuTitle) => withSubMenuDesign({
  List: asMenuSubList(titleDesign),
});

/**
 * Helper which can be used to add a Touts submenu option to the menu.
 *
 * @param titleDesign? optional token which will be applied to the sublist title.
 *
 */
const withToutSubMenu = (titleDesign: HOC = asMenuTout) => withSubMenuDesign({
  Touts: asMenuSubList(titleDesign),
});

/**
 * Helper which can be used to add a Columns submenu option to the menu.
 *
 * @param titleDesign? optional token which will be applied to the sublist title.
 *
 */
const withColumnSubMenu = (titleDesign: HOC = asMenuTitle) => withSubMenuDesign({
  Columns: asToken(
    asMenuSubList(titleDesign),
    withSubLists(1)(asMenuSubList(titleDesign, () => ({ groupLabel: 'Column Sub-Menu Item' }))),
  ),
});

export {
  withListSubMenu,
  withToutSubMenu,
  withColumnSubMenu,
  withSubMenuDesign,
};
