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

import { flowRight } from 'lodash';
import {
  PageEditContextInterface,
  TMenuOptionGetter,
  withMenuOptions,
  EditButtonProps,
  withoutProps,
} from '@bodiless/core';
import { renderTagsForm } from './TagForm';
import { TagButtonOptions } from './types';

const createMenuOptionHook = <P extends object, D extends object>(options: TagButtonOptions) => (
  props: P & EditButtonProps<D>,
  context: PageEditContextInterface,
) => {
  const getMenuOptions: TMenuOptionGetter = () => [
    {
      icon: 'local_offer',
      name: 'tags',
      global: false,
      local: true,
      handler: () => renderTagsForm({ ...options, ...props }, context),
    },
  ];

  return getMenuOptions;
};

const withTagButton = (
  options: TagButtonOptions,
) => flowRight(
  withMenuOptions({
    useGetMenuOptions: createMenuOptionHook(options),
    name: 'tags',
  }),
  withoutProps(['setComponentData', 'unwrap', 'isActive']),
);

export default withTagButton;
