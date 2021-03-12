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

import { asBreadcrumbSource, withEditableMenuTitle } from './MenuTitles';

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
    withEditableMenuTitle,
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
 * @param menuTitleDesign? optional token which will be applied to the sublist title.
 *
 */
const withListSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  List: asMenuSubList(menuTitleDesign),
});

/**
 * Helper which can be used to add a Touts submenu option to the menu.
 *
 * @param menuTitleDesign? optional token which will be applied to the sublist title.
 *
 */
const withToutSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  Touts: asMenuSubList(menuTitleDesign),
});

/**
 * Helper which can be used to add a Columns submenu option to the menu.
 *
 * @param menuTitleDesign? optional token which will be applied to the sublist title.
 *
 */
const withColumnSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  Columns: asToken(
    asMenuSubList(menuTitleDesign),
    withSubLists(1)(asMenuSubList(menuTitleDesign, () => ({ groupLabel: 'Column Sub-Menu Item' }))),
  ),
});

export {
  withListSubMenu,
  withToutSubMenu,
  withColumnSubMenu,
  withSubMenuDesign,
};
