/**
 * Copyright © 2019 Johnson & Johnson
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
  addClasses,
  withDesign,
} from '@bodiless/fclasses';
import {
  asToutVertical as asBToutVertical,
  asToutHorizontal as asBToutHorizontal,
  asToutNoTitle as asToutNoTitle$,
  asToutNoBody as asToutNoBody$,
  asToutNoCta as asToutNoCta$,
  asToutOverlayTitle as asToutOverlayTitle$,
  asToutOverlayCta as asToutOverlayCta$,
  asToutNoBodyNoTitle as asToutNoBodyNoTitle$,
} from '@bodiless/organisms';
import {
  asImageRounded,
  asCta,
  asHeader2,
  asBlockItem,
  asTextColorPrimary,
} from '../Elements.token';
import { asToken } from '../../data/pages/tokens/TokenMap';

const asToutHorizontal$ = flow(
  withDesign({
    Title: addClasses('px-2'),
    Body: addClasses('px-2'),
    Link: addClasses('md:mx-2'),
  }),
  asBToutHorizontal,
);
const asToutVertical$ = flow(
  withDesign({
    Title: addClasses('px-2'),
    Body: addClasses('px-2'),
  }),
  asBToutVertical,
);

const asToutDefaultStyle$ = withDesign({
  Wrapper: asTextColorPrimary,
  Image: asImageRounded,
  Title: asHeader2,
  Link: asCta,
});

const asToutWithPaddings$ = withDesign({
  Wrapper: asBlockItem,
});

const asToutTextWhite$ = withDesign({
  // ContentWrapper: addClasses('text-white'),
  Title: addClasses('text-white'),
  Body: addClasses('text-white'),
});

const asToutHorizontal = asToken('Orientation')(asToutHorizontal$);
const asToutVertical = asToken('Orientation')(asToutVertical$);
const asToutNoTitle = asToken('Structure')(asToutNoTitle$);
const asToutNoBody = asToken('Structure')(asToutNoBody$);
const asToutNoCta = asToken('Structure')(asToutNoCta$);
const asToutDefaultStyle = asToken('Appearance')(asToutDefaultStyle$);
const asToutOverlayTitle = asToken('Layout')(asToutOverlayTitle$);
const asToutOverlayCta = asToken('Layout')(asToutOverlayCta$);
const asToutNoBodyNoTitle = asToken('Structure')(asToutNoBodyNoTitle$);
const asToutWithPaddings = asToken('Layout')(asToutWithPaddings$);
const asToutTextWhite = asToken('Appearance')(asToutTextWhite$);
const asToutMainMenu = flow(
  asToutTextWhite,
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

export {
  asToutHorizontal,
  asToutVertical,
  asToutNoTitle,
  asToutNoBody,
  asToutNoCta,
  asToutDefaultStyle,
  asToutOverlayTitle,
  asToutOverlayCta,
  asToutNoBodyNoTitle,
  asToutWithPaddings,
  asToutTextWhite,
  asToutMainMenu,
};
