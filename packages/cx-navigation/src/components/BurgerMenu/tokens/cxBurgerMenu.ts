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

import { asStatic } from '@bodiless/core';
import { cxColor } from '@bodiless/cx-elements';
import {
  addClassesIf,
  as,
  flowHoc,
} from '@bodiless/fclasses';
import { useIsBurgerMenuHidden } from '@bodiless/navigation';
import { cxMenu } from '../../Menu';
import { cxMenuToggler } from '../../MenuToggler';
import { asBurgerMenuToken } from '../BurgerMenuClean';

/**
 * Token that provides Push animation to the Burger Menu.
 */
const WithBurgerMenuPush = asBurgerMenuToken({
  Behavior: {
    Wrapper: flowHoc(
      addClassesIf(useIsBurgerMenuHidden)('transform -translate-x-full'),
      // @TODO: Maybe, put custom ease in tailwind theme configs?
      as('transition-all duration-200 ease-[cubic-bezier(.165,.84,.44,1)]'),
    ),
  },
});

/**
 * Token that produces the Base CanvasX Burger Menu.
 */
const Base = asBurgerMenuToken({
  Core: {
    _: asStatic,
  },
  Components: {
    MenuToggler: cxMenuToggler.Close,
    Menu: cxMenu.Burger,
    UtilityMenu: cxMenu.Utility,
  },
  Layout: {
    Wrapper: 'w-full h-full fixed left-0 top-0 md:w-7/12 lg:hidden',
    Container: 'flex flex-col',
    FooterWrapper: 'w-full fixed left-0 bottom-0 flex flex-col items-center md:w-7/12',
    ActionFooterContainer: 'w-full flex justify-center items-center',
    Overlay: 'w-full h-full fixed left-0 top-0',
  },
  Spacing: {
    MenuWrapper: 'px-9',
    FooterWrapper: 'px-9 py-6',
    ActionFooterContainer: 'mt-5',
  },
  Theme: {
    Wrapper: as(
      cxColor.BgPrimaryCard,
      'z-10',
    ),
    FooterWrapper: as(
      // @TODO: Is this bg color name correct for this wrapper?
      cxColor.BgPrimaryCard,
      // @TODO: Create tokens for borders?
      'border-t-2 border-cx-primary-page-bg',
    ),
    // @TODO: Should these effects be combined as a new tailwind custom class?
    Overlay: 'z-5 bg-gray-112-10 backdrop-blur-m-md backdrop-brightness-80',
  },
  Behavior: {
    // Needs to hide it when menu is closed, otherwise it will not allow page interaction.
    Overlay: flowHoc(
      addClassesIf(useIsBurgerMenuHidden)('hidden'),
    ),
  },
});

const Default = asBurgerMenuToken({
  ...Base,
  Compose: {
    WithBurgerMenuPush,
  },
});

export default {
  Base,
  Default,
};
