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
  withTitle,
  withDesc,
} from '@bodiless/layouts';
import {
  replaceWith,
  withDesign,
  varyDesign,
  extendDesign,
  HOC,
  Design,
} from '@bodiless/fclasses';
import { ToutClean } from '@bodiless/organisms';
import { withType } from '../FlowContainer/Categories';
import { withOrientationFacet, withStructureFacet } from '../FlowContainer/withToutVariations';
import { withToutEditors, withToutResetButtons } from '../Tout';
import { asToutDefaultStyle, asToutHorizontal, asToutVertical } from '../Tout/token';
import withEditLink from '../../data/pages/headless/withEditLink';

const asHeadlessToutBese = flow(
  replaceWith(ToutClean),
  withToutEditors,
  withToutResetButtons,
  asToutDefaultStyle,
);

const baseVariation: Design<any> = {
  HeadlessTout: flow(
    asHeadlessToutBese,
    withType('Tout')(),
    withTitle('Headless Tout'),
    withDesc('Demo tout to render headless content'),
    withStructureFacet('With Title and Body')(),
    withStructureFacet('With CTA')(),
  ) as HOC,
};

// Lets make Tout version that are Vertical and vary the fields that are used
const verticalVariations = varyDesign(
  {
    Vertical: withOrientationFacet('Vertical')(asToutVertical),
  },
  // {
  //   WithTitleBody: withStructureFacet('With Title and Body')(),
  //   NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  //   NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
  //   NoTitleBody: withStructureFacet('No Title and Body')(asToutNoBodyNoTitle as HOC),
  // },
);
// Lets make Tout version that are Horizontal and vary the fields that are used
const horizontalVariations = varyDesign(
  {
    Horizontal: withOrientationFacet('Horizontal')(asToutHorizontal as HOC),
  },
  // {
  //   WithTitleBody: withStructureFacet('With Title and Body')(),
  //   NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  //   NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
  // },
);
// LEts combine the Vertical and Horizontal
const orientationVariations = extendDesign(
  horizontalVariations,
  verticalVariations,
);

// const ctaVariations = {
//   WithCTA: withStructureFacet('With CTA')(),
//   NoCTA: withStructureFacet('No CTA')(asToutNoCta as HOC),
// };

export default withDesign(varyDesign(
  baseVariation,
  orientationVariations,
  // ctaVariations,
)());
