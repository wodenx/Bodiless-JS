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

import { asFluidToken } from '@bodiless/vital-elements';
import { on, varyDesigns, flowHoc } from '@bodiless/fclasses';
import {
  asTableToken, TableClean, vitalTable,
} from '../Table';

const BaseVariation = {
  Table: on(TableClean)(vitalTable.Default, vitalTable.WithFlowContainerPreview),
};

const HeaderDecorationVariations = {
  LightHeaderFooter: vitalTable.WithLightHeaderFooter,
  FirstColumnHeader: vitalTable.WithFirtColumnHeader,
  None: asTableToken({
    Meta: flowHoc.meta.term('Header')('No Header Color'),
  }),
};

const TableVariations = {
  Stripes: vitalTable.WithRowStripes,
  Hoverable: vitalTable.WithHoverable,
  ScrollingTable: vitalTable.WithScrolling,
};

const BorderDecorationVariations = {
  Borders: vitalTable.WithBorders,
  BottomBorders: vitalTable.WithBottomBorders,
  None: asTableToken({
    Meta: flowHoc.meta.term('Border')('No Border'),
  }),
};

const fluidToken = asFluidToken();
type FluidToken = typeof fluidToken;
export interface VitalTableFlowContainer {
  WithTableVariations: FluidToken,
  /**
   * Defines a set of composed table varations to add to Flow Container. With the following
   * variations:
   * - No background Header/Footer color
   * - Background Color on Header/Footer @see [[vitalTable.WithLightHeaderFooter]]
   * - Background Color on First column @see [[vitalTable.WithFirtColumnHeader]]
   * - Background color on Odd Rows  @see [[vitalTable.WithRowStripes]]
   * - Background Color on Hover @see [[vitalTable.WithHoverable]]
   * - Adds Scroll if table exceed viewport @see [[vitalTable.WithScrolling]]
   * - Adds Borders to all cells  @see [[vitalTable.WithBorders]]
   * - Add Borders to bottom of cells  @see [[vitalTable.WithBottomBorders]]
   * - No Borders (default)
   */
}
const WithTableVariations = asFluidToken({
  Components: {
    ...varyDesigns(
      BaseVariation,
      TableVariations,
      BorderDecorationVariations,
      HeaderDecorationVariations,
    ),
  }
});

export const vitalTableFlowContainer = { WithTableVariations };
