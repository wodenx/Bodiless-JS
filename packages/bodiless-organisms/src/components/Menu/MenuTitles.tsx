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
  withNode, withNodeKey, withSidecarNodes,
} from '@bodiless/core';
import { replaceWith, HOC, stylable } from '@bodiless/fclasses';
import {
  asBodilessLink, withBodilessLinkToggle,
} from '@bodiless/components';
import { asSubMenuTitle } from './asMenu';
import { ToutClean } from '../Touts';
import MenuLink from '../MainMenu/MenuLink';

export const asMenuTout = (withToutEditors: any) => flow(
  replaceWith(ToutClean),
  withToutEditors,
  withNode,
  withNodeKey('title'),
  asSubMenuTitle,
);

export const asMenuLink = (asEditable: HOC) => flow(
  replaceWith(MenuLink),
  withSidecarNodes(
    withBodilessLinkToggle(
      asBodilessLink('link') as HOC,
    ),
  ),
  stylable,
  asSubMenuTitle,
  asEditable,
  withNode,
  withNodeKey('title'),
) as HOC;

// const SafeFragment = withOnlyProps('key', 'children')(Fragment);
// export const asMenuLink = (asEditable: HOC) => flowRight(
//   withNodeKey('title'),
//   withNode,
//   asSubMenuTitle,
//   asEditable,
//   startSidecarNodes,
//   withNodeKey('link'),
//   withNode,
//   withBodilessComponentFormToggle('toggle'),
//   asBodilessLink(),
//   ifBodilessToggleOff('toggle')(
//     endSidecarNodes,
//     ifEditable(replaceWith(Span)),
//     ifReadOnly(replaceWith(SafeFragment)),
//   ),
//   ifBodilessTogggleOn('toggle')(
//     endSidecarNodes,
//   ),
//   replaceWith(MenuLink),
// ) as HOC;

export const asDefaultMenuLink = asMenuLink(identity);

export const asDefaultMenuTout = asMenuTout(identity);
