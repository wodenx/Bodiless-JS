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

import { addClasses, asToken } from '@bodiless/fclasses';

export const withMeta = (component: string) => (category: string) => (attribute: string) => ({
  categories: {
    Category: Array.isArray(category) ? category : [category],
    Attribute: Array.isArray(attribute) ? attribute : [attribute],
    Component: [component],
  },
});

export const asElementToken = withMeta('Element');
export const asListToken = withMeta('List');

export const asFlex = asToken(
  addClasses('flex'),
  asElementToken('Layout')('Display'),
);

export const asRelative = asToken(
  addClasses('relative'),
  asElementToken('Layout')('Position'),
);

export const asAbsolute = asToken(
  addClasses('absolute'),
  asElementToken('Layout')('Position'),
);

export const asFixed = asToken(
  addClasses('fixed'),
  asElementToken('Layout')('Position'),
);

export const asOverflowHidden = asToken(
  addClasses('overflow-hidden'),
  asElementToken('Layout')('Overflow'),
);

export const withVisibleOnHoverStyles = asToken(
  addClasses('hover:overflow-visible'),
  asElementToken('Layout')('Overflow'),
);

export const withStaticOnHoverStyles = asToken(
  addClasses('hover:static'),
  asElementToken('Layout')('Overflow'),
);

export const asPositionedLeft = asToken(
  addClasses('left-0'),
  asElementToken('Layout')('Inset'),
);

export const withNoInsetStyles = asToken(
  addClasses('inset-0'),
  asElementToken('Layout')('Inset'),
);

export const withFullZIndex = asToken(
  addClasses('z-full'),
  asElementToken('Layout')('Position'),
);

export const withFullWidthStyles = asToken(
  addClasses('w-full'),
  asElementToken('Sizing')('Width'),
);

export const withFullHeightStyles = asToken(
  addClasses('h-full'),
  asElementToken('Sizing')('Height'),
);

export const withColumnDirectionStyles = asToken(
  addClasses('flex-col'),
  // @todo confirm category & term spelling
  asElementToken('Flexbox')('Flex Direction'),
);

export const withLightGrayBg = asToken(
  addClasses('bg-gray-200'),
  asElementToken('Backgrounds')('Color'),
);

export const withTransformStyles = asToken(
  addClasses('transform'),
  asElementToken('Transforms')('Transform'),
);

export const withSlideInTranslateStyles = asToken(
  addClasses('-translate-x-full'),
  asElementToken('Transforms')('Translate'),
);

// @todo term for .material-icons?
export const withMaterialIconsFont = asToken(
  addClasses('material-icons'),
  asElementToken('Typography')('Font Family'),
);

export const withPointerCursorStyles = asToken(
  addClasses('cursor-pointer'),
  asElementToken('Interactivity')('Cursor'),
);

export const asDisabled = asToken(
  addClasses('pointer-events-none'),
  asElementToken('Interactivity')('Pointer Events'),
);
