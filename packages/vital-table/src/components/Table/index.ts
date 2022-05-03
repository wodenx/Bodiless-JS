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
import type { TokenDemoSpec } from '@bodiless/tokens';
import vitalTable from './tokens';
import vitalTableBase from './tokens/vitalTable';
import TableClean, { asTableToken } from './TableClean';

const vitalTableSpec: TokenDemoSpec = {
  title: 'Components/Table',
  component: TableClean,
  tokens: vitalTable,
  defaultTokens: ['Default'],
  componentExportName: 'TableClean',
  tokensExportName: 'vitalTable',
};

export {
  vitalTable,
  vitalTableBase,
  TableClean,
  asTableToken,
  vitalTableSpec,
};

export * from './index.bl-edit';

export type { TableComponents } from '@bodiless/table';
