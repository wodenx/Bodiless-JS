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
  TokenDef, HOC, Design, withDesign, asToken,
} from '@bodiless/fclasses';
import {
  asStylableList, asStylableSubList, asSubList, withDeleteNodeOnUnwrap,
  withSubLists, UseListOverrides,
} from '@bodiless/components';

import { withEditableMenuTitle, asMenuTout } from './MenuTitles';

/**
 * Creates a stylable sublist which deletes it's data when the last item is removed.
 * Suitable for use for all menus.
 */
const asMenuSubList = (titleDesign: any = {}, useOverrides: UseListOverrides = () => ({})) => {
  const titleDesign$ = typeof titleDesign === 'function' ? titleDesign : withDesign(titleDesign);
  return flow(
    asSubList((props) => ({ groupLabel: 'Sub-Menu Item', ...useOverrides(props) })),
    asStylableList,
    asStylableSubList,
    withDeleteNodeOnUnwrap('sublist'),
    withEditableMenuTitle,
    withDesign({
      Title: titleDesign$,
    }),
  );
};

const withSubMenuDesign = (design: Design<any>) => withDesign({
  Item: withDesign(design),
});

const withColumnSubMenuDesign = (...tokenDefs: TokenDef<any>[]) => withDesign({
  Item: withDesign({
    SubList: asToken(...tokenDefs),
  }),
});

const withListSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  List: asMenuSubList(menuTitleDesign),
});

const withToutSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  Touts: flow(
    asMenuSubList(menuTitleDesign),
    withDesign({
      Title: asMenuTout(),
    }),
  ),
});

const withColumnSubMenu = (menuTitleDesign?: Design<any> | HOC) => withSubMenuDesign({
  Columns: flow(
    asMenuSubList(menuTitleDesign),
    withSubLists(1)(asMenuSubList(menuTitleDesign, () => ({ groupLabel: 'Column Sub-Menu Item' }))),
  ),
});

export {
  withListSubMenu,
  withToutSubMenu,
  withColumnSubMenu,
  withSubMenuDesign,
  withColumnSubMenuDesign,
};
