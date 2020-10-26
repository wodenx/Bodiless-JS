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

import React, { FC } from 'react';
import ReactTooltip from 'rc-tooltip';
import { flow } from 'lodash';
import { addClasses, addProps } from '@bodiless/fclasses';
import {
  ContextMenu, ContextMenuProps, ContextMenuUI,
} from '@bodiless/core';
import {
  ComponentFormTitle, ComponentFormLabel, ComponentFormText, ComponentFormButton,
  ComponentFormCloseButton, ComponentFormSubmitButton, ToolbarIcon, Div, HorizontalToolbarButton,
  ComponentFormUnwrapButton, ComponentFormTextArea, ComponentFormDescription, ComponentFormWarning,
  ComponentFormFieldWrapper, ComponentFormFieldTitle, ComponentFormCheckBox, ComponentFormRadio,
  ComponentFormRadioGroup, ComponentFormSelect, ComponentFormOption, ContextSubMenu,
  ToolbarButtonLabel,
} from '@bodiless/ui';
import ReactTagsField from './ReactTags';

// For accessibility attributes, see https://www.w3.org/TR/wai-aria-practices/examples/toolbar/toolbar.html
const Toolbar = flow(
  addClasses('bl-flex'),
  addProps({ role: 'toolbar', 'aria-label': 'Local Context Menu' }),
)(Div);

const LocalTooltip: FC<ReactTooltip['props']> = props => (
  <ReactTooltip
    {...props}
    placement="bottomLeft"
  />
);

export const FormWrapper = addClasses('bl-flex')(Div);

const ui: ContextMenuUI = {
  ComponentFormText,
  ComponentFormTextArea,
  ComponentFormFieldWrapper,
  ComponentFormFieldTitle,
  ComponentFormCheckBox,
  ComponentFormRadio,
  ComponentFormRadioGroup,
  ComponentFormSelect,
  ComponentFormOption,
  ComponentFormButton,
  ComponentFormCloseButton,
  ComponentFormUnwrapButton,
  ComponentFormSubmitButton,
  ComponentFormTitle,
  ComponentFormLabel,
  ComponentFormDescription,
  ContextSubMenu,
  ComponentFormWarning,
  Icon: ToolbarIcon,
  Toolbar,
  ToolbarButton: HorizontalToolbarButton,
  ToolbarButtonLabel,
  FormWrapper,
  Tooltip: LocalTooltip,
  ReactTags: ReactTagsField,
};

const LocalContextMenu: FC<ContextMenuProps> = props => (
  <ContextMenu {...props} ui={ui} />
);

export default LocalContextMenu;
