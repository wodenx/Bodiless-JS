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
import { WithNodeKeyProps } from '@bodiless/core';
import { asBodilessList, asStylableList, asChameleonSubList } from '@bodiless/components';
import { withDesign } from '@bodiless/fclasses';

import type { UseListOverrides, ListDefaultDataType } from '@bodiless/components';

import withMenuContext from './withMenuContext';
import { withEditableMenuTitle, asBreadcrumbSource } from './MenuTitles';

const withChameleonSublist = withDesign({
  Item: asChameleonSubList(() => ({ formTitle: 'Sub-Menu Type' })),
});

const asBodilessMenu = <P extends object>(
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ListDefaultDataType,
  useOverrides: UseListOverrides<P> = () => ({}),
) => flow(
    asBodilessList(
      nodeKeys,
      defaultData,
      (props: P) => ({ groupLabel: 'Main Menu Item', ...useOverrides(props) }),
    ),
    withChameleonSublist,
    asStylableList,
    withMenuContext,
    withEditableMenuTitle,
    asBreadcrumbSource,
  );

export default asBodilessMenu;
