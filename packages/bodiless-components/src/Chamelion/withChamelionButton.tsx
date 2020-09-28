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

import React, { ComponentType } from 'react';
import {
  withMenuOptions, useContextMenuForm, useMenuOptionUI, withContextActivator, withLocalContextMenu,
  TMenuOption,
} from '@bodiless/core';

import { flowRight } from 'lodash';
import { v1 } from 'uuid';
import {
  ChamelionButtonProps, ChamelionData, UseOverrides,
} from './types';
import { useChamelionContext, DEFAULT_KEY } from './withChamelionContext';

const useToggleButtonMenuOption = () => {
  const {
    isOn, selectableComponents, setActiveComponent,
  } = useChamelionContext();
  const newKey = isOn ? null
    : Object.keys(selectableComponents).find(key => key !== DEFAULT_KEY) || null;
  return {
    label: 'Toggle',
    icon: isOn ? 'toggle_off' : 'toggle_on',
    handler: () => setActiveComponent(newKey),
  };
};

const useSwapButtonMenuOption = () => {
  const { selectableComponents, activeComponent, setActiveComponent } = useChamelionContext();
  const renderForm = () => {
    const {
      ComponentFormLabel,
      ComponentFormRadioGroup,
      ComponentFormRadio,
      ComponentFormTitle,
    } = useMenuOptionUI();
    const radios = Object.getOwnPropertyNames(selectableComponents).map(name => (
      <ComponentFormLabel key={name} htmlFor={`bl-component-form-chamelion-radio-${name}`}>
        <ComponentFormRadio value={name} id={`bl-comonent-form-chamelion-radio-${name}`} />
        {/* @ts-ignore */}
        {selectableComponents[name].title || name}
      </ComponentFormLabel>
    ));
    return (
      <>
        <ComponentFormTitle>Choose a component</ComponentFormTitle>
        <ComponentFormRadioGroup field="component">
          {radios}
        </ComponentFormRadioGroup>
      </>
    );
  };
  const render = useContextMenuForm({
    initialValues: { component: activeComponent === DEFAULT_KEY ? null : activeComponent },
    submitValues: (d: ChamelionData) => setActiveComponent(d.component || null),
    renderForm,
  });
  return {
    icon: 'repeat',
    label: 'Swap',
    handler: () => render,
  };
};

export const withUnwrap = <P extends object>(Component: ComponentType<P>) => {
  const WithUnwrapChamelion = (props: P & ChamelionButtonProps) => {
    const { isOn, setActiveComponent } = useChamelionContext();
    if (!isOn) return <Component {...props} />;
    const unwrap = () => setActiveComponent(null);
    return <Component {...props} unwrap={unwrap} />;
  };
  return WithUnwrapChamelion;
};

/**
 * Adds a menu button which controls the state of the chamelion.
 *
 * If the chamelion has more than one element in it's design, this will show a form allowing
 * the user to choose which to apply.  Otherwise, this will be a toggle button.
 *
 * @param nodeKeys Location of the chamelion state data
 * @param defaultData Default chamelion state data.
 * @param useOverrides Menu option overrides.
 *
 * @return HOC which adds the menu button.
 */
const withChamelionButton = <P extends object>(
  useOverrides?: UseOverrides<P>,
) => {
  const useMenuOptions = (props: P):TMenuOption[] => {
    const { selectableComponents } = useChamelionContext();
    const extMenuOptions = Object.keys(selectableComponents).length > 1
      ? useSwapButtonMenuOption
      : useToggleButtonMenuOption;
    const name = `chamelion-${v1()}`;
    const baseDefinition:TMenuOption = {
      name,
      group: `${name}-group`,
      global: false,
      local: true,
      ...extMenuOptions(),
    };
    const overrides = useOverrides ? useOverrides(props) : {};
    // if useOverrides returns undefined, it means not to provide the button.
    if (overrides === undefined) return [];
    const { groupMerge, groupLabel, ...overrides$ } = overrides;
    const menuOption:TMenuOption = { ...baseDefinition, ...overrides$ };
    // Create a group so we have control over name and merge behavior.
    const menuGroup:TMenuOption = {
      name: menuOption.group!, // We set the group above so we know it's defined.
      label: groupLabel || menuOption.label,
      local: menuOption.local,
      global: menuOption.global,
      Component: 'group',
      groupMerge,
    };
    // return [menuOption];
    return [menuOption, menuGroup];
  };
  return flowRight(
    withMenuOptions({ useMenuOptions, name: 'Chamelion' }),
    withContextActivator('onClick'),
    withLocalContextMenu,
    withUnwrap,
  );
};

export default withChamelionButton;
