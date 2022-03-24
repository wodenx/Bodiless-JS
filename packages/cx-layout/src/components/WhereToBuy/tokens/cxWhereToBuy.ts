/**
 * Copyright © 2022 Johnson & Johnson
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

import { cxColor, cxFontSize, cxTextDecoration } from '@bodiless/cx-elements';
import {
  as,
  withProps,
  replaceWith,
} from '@bodiless/fclasses';
import { asWhereToBuyToken } from '../WhereToBuyClean';

const Base = asWhereToBuyToken({
  // @TODO: After Where to Buy, readjust layout.
  Layout: {
    Wrapper: 'w-full lg:w-auto',
    Button: 'flex justify-center items-center max-w-64 h-12 lg:max-w-48',
  },
  Spacing: {
    Button: 'mx-auto p-3 lg:px-7',
    Icon: 'mr-3',
  },
  Theme: {
    Button: as(
      cxFontSize.Base,
      cxColor.BgPrimaryInteractive,
      cxColor.TextPrimaryFooterCopy,
      cxTextDecoration.Bold,
      cxTextDecoration.Uppercase,
      // 'text-m-base',
      'rounded',
    ),
    Icon: 'w-6 h-6',
    Label: 'leading',
  },
  // @TODO: Placeholders must be replaced with editable fields.
  Content: {
    Label: withProps({
      children: 'Where to Buy',
    }),
  },
});

const Default = asWhereToBuyToken({
  ...Base,
});

/**
 * Token that provides the Where To Buy button without an icon.
 */
const WithoutIcon = asWhereToBuyToken({
  ...Base,
  Components: {
    Icon: replaceWith(() => null),
  },
});

export default {
  Base,
  Default,
  WithoutIcon,
};
