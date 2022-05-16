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

import React from 'react';
import { withoutHydration } from '@bodiless/hydration';
import {
  CleanTable,
} from '@bodiless/table';
import { asVitalTokenSpec } from '@bodiless/vital-elements';
import type { TableComponents } from '@bodiless/table';

/**
 * This is the base component for tables.
 *
 * @category Component
 *
 * @example
 * **Create a default table:**
 * ```
 * const DefaultTable = on(TableClean)(vitalTable.Default)
 * ```
 */
const TableClean = CleanTable;

/**
 * Use this version of the table when all components are static.
 * @category Component
 * @example
 * **Create a default table:**
 * ```
 * const DefaultStaticTable = on(TableStatic)(vitalTable.Default)
 * ```
 */
const TableStatic = withoutHydration()(CleanTable);
const asTableToken = asVitalTokenSpec<TableComponents>();

/**
 * This is the preview component that shows a gray text 'Cell' use in the component picker
 *
 * @category Component
 */
const TableCellPreview = () => <span className="bl-text-gray-800">Cell</span>;

export default TableClean;
export { asTableToken, TableStatic, TableCellPreview };
