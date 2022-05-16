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

import {
  flowIf,
  and,
  flowHoc,
  on,
  as,
  replaceWith,
  addProps,
} from '@bodiless/fclasses';
import {
  asBodilessTable, useIsFirstColumn, useIsInBody, useIsOddRow,
} from '@bodiless/table';
import { vitalRichText, RichTextClean } from '@bodiless/vital-editors';
import { vitalColor } from '@bodiless/vital-elements';
import { ifComponentSelector } from '@bodiless/layouts';
import { asTableToken, TableCellPreview } from '../TableClean';

const WithFlowContainerPreview = asTableToken({
  Flow: ifComponentSelector,
  Core: {
    CellContent: replaceWith(TableCellPreview),
  },
});

const Base = asTableToken({
  Meta: flowHoc.meta.term('Type')('Table'),
  Schema: {
    _: asBodilessTable(),
  },
  Editors: {
    CellContent: on(RichTextClean)(vitalRichText.Default, addProps({ placeholder: 'Cell' })),
  },
});

const Default = asTableToken({
  ...Base,
  Theme: {
    ...Base.Theme,
    Table: 'min-w-full',
    CellContent: 'text-left',
  },
  Spacing: {
    ...Base.Spacing,
    Cell: 'pt-6 px-6',
  },
});

const WithFirtColumnHeader = asTableToken({
  Meta: flowHoc.meta.term('Header')('First Column as Header'),
  Theme: {
    Cell: flowIf(useIsFirstColumn)(as(vitalColor.BgSecondaryTable)),
  }
});

const WithRowStripes = asTableToken({
  Meta: flowHoc.meta.term('Decoration')('Stripes'),
  Theme: {
    Row: flowIf(and(useIsInBody, useIsOddRow))(as(vitalColor.BgSecondaryTableRowColumn)),
  }
});

const WithHoverable = asTableToken({
  Meta: flowHoc.meta.term('Decoration')('Hoverable Rows'),
  Theme: {
    Row: vitalColor.BgSecondaryTableInteractive,
  }
});

const WithBorders = asTableToken({
  Meta: flowHoc.meta.term('Border')('Bordered Cells'),
  Theme: {
    Row: 'border',
  }
});

const WithBottomBorders = asTableToken({
  Meta: flowHoc.meta.term('Border')('Bottom Bordered'),
  Theme: {
    THead: 'border-b',
    Row: 'border-b',
  }
});

const WithLightHeaderFooter = asTableToken({
  Meta: flowHoc.meta.term('Header')('Light Header'),
  Theme: {
    THead: vitalColor.BgSecondaryTable,
    TFoot: vitalColor.BgSecondaryTable,
  }
});

const WithScrolling = asTableToken({
  Meta: flowHoc.meta.term('Decoration')('Scrolling'),
  Theme: {
    Wrapper: 'overflow-x-auto',
  }
});

type AsTableToken = typeof asTableToken;

/**
 * Tokens for the vital table
 *
 * @category Token Collection
 * @see [[VitalTableClean]]
 */
export interface VitalTable {
  /**
   * Defines the base table for the Vital DS.
   * - Editable table.
   * - Editable Rich Text Editors in the cells.
   */
  Base: AsTableToken,
  /**
   * Defines the default table for the Vital DS building off the Base
   * - Editable table.
   * - Editable Rich Text Editors in the cells.
   * and defines some base styling that all tables use.
   * - Table expands to full width in space it is in
   * - Cell text content is left aligned
   * - Padding at top and sides of cell (RTE adds it own bottom padding)
   *
   * #### Customizing:
   *
   * @example The following is an example that
   * - overrides full width and uses fixed widths for columns. The width of
   * the first row will set the column widths for the whole table.
   * - Data of cells will be centered.
   * - CellContent will be replace a RTE with your custom Flow container component.
   *
   * ```js
   * import { vitalTableBase } from '@bodiless/vital-table';
   *
   * const Default = asTableToken(vitalTableBase.Default, {
   *   Components: {
   *     Cell: on(MyFlowContainerClean)(myComponentFlowContainer.Default),
   *   }
   *   Theme: {
   *     Table: 'table-fixed',
   *     Cell: 'text-center',
   *   },
   * });
   * ```
   */
  Default: AsTableToken,
  /**
   * Composable token which makes the first column of the table use color:
   * vitalColor.BgSecondaryTable
   */
  WithFirtColumnHeader: AsTableToken,
  /**
   * Composable token which add a background color to the odd rows using color:
   * vitalColor.BgSecondaryTableRowColum
   */
  WithRowStripes: AsTableToken,
  /**
   * Composable token which on hover highlights the row background with color:
   * vitalColor.BgSecondaryTableInteractive
   */
  WithHoverable: AsTableToken,
  /**
   * Composable token which adds borders to all cells.
   */
  WithBorders: AsTableToken,
  /**
   * Composable token which adds borders to the bottom of the cells.
   */
  WithBottomBorders: AsTableToken,
  /**
   * Composable token which adds the backgournd color to the header/footer of the table.
   * Uses color: vitalColor.BgSecondaryTable
   */
  WithLightHeaderFooter: AsTableToken,
  /**
   * Composable token which a scrollbar to the table if exceeds the viewport.
   */
  WithScrolling: AsTableToken,
  /**
   * Composable token which provides a custom preview of the table in the component picker.
   */
  WithFlowContainerPreview: AsTableToken,
}

/**
 * Tokens for Table.
 *
 * @category Token Collection
 * @see [[VitalTable]]
 * @see [[VitalTableClean]]
 */
export default {
  Default,
  WithRowStripes,
  WithHoverable,
  WithBorders,
  WithBottomBorders,
  WithLightHeaderFooter,
  WithFirtColumnHeader,
  WithScrolling,
  WithFlowContainerPreview,
};
