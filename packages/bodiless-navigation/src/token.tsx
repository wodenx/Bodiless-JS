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

const { meta } = asToken;

export const asFlex = asToken(
  addClasses('flex'),
  meta.term('Layout')('Display'),
);

export const withFullWidthStyles = asToken(
  addClasses('w-full'),
  meta.term('Sizing')('Width'),
);

export const withFullHeightStyles = asToken(
  addClasses('h-full'),
  meta.term('Sizing')('Height'),
);

export const asOverflowHidden = asToken(
  addClasses('overflow-hidden'),
  meta.term('Layout')('Overflow'),
);

export const asRelative = asToken(
  addClasses('relative'),
  meta.term('Layout')('Position'),
);

export const asAbsolute = asToken(
  addClasses('absolute'),
  meta.term('Layout')('Position'),
);

export const asFixed = asToken(
  addClasses('fixed'),
  meta.term('Layout')('Position'),
);

export const asPositionedLeft = asToken(
  addClasses('left-0'),
  meta.term('Layout')('Inset'),
);

export const withNoInsetStyles = asToken(
  addClasses('inset-0'),
  meta.term('Layout')('Inset'),
);

export const withFullZIndex = asToken(
  addClasses('z-full'),
  meta.term('Layout')('Position'),
);

export const withColumnDirectionStyles = asToken(
  addClasses('flex-col'),
  // @todo confirm category & term spelling
  meta.term('Flexbox')('Flex Direction'),
);

export const withLightGrayBg = asToken(
  addClasses('bg-gray-200'),
  meta.term('Backgrounds')('Color'),
);

export const withTransformStyles = asToken(
  addClasses('transform'),
  meta.term('Transforms')('Transform'),
);

export const withSlideInTranslateStyles = asToken(
  addClasses('-translate-x-full'),
  meta.term('Transforms')('Translate'),
);

// @todo term for .material-icons?
export const withMaterialIconsFont = asToken(
  addClasses('material-icons'),
  meta.term('Typography')('Font Family'),
);

export const withPointerCursorStyles = asToken(
  addClasses('cursor-pointer'),
  meta.term('Interactivity')('Cursor'),
);
