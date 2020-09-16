import React, { ComponentType } from 'react';
import {
  withMenuOptions, useContextMenuForm, useMenuOptionUI,
} from '@bodiless/core';

import { flowRight } from 'lodash';
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
        {selectableComponents[name].title}
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
const withChamelionButton = <P extends object>(useOverrides?: UseOverrides<P>) => {
  const useMenuOptions = (props: P) => {
    const { selectableComponents } = useChamelionContext();
    const extMenuOptions = Object.keys(selectableComponents).length > 1
      ? useSwapButtonMenuOption
      : useToggleButtonMenuOption;
    const baseDefinition = {
      name: 'chamelion-toggle',
      global: false,
      local: true,
      ...extMenuOptions(),
    };
    const overrides = useOverrides ? useOverrides(props) : {};
    // if useOverrides returns undefined, it means not to provide the button.
    return typeof overrides !== 'undefined' ? [{ ...baseDefinition, ...overrides }] : [];
  };
  return flowRight(
    withMenuOptions({ useMenuOptions, name: 'Chamelion' }),
    withUnwrap,
  );
};

export default withChamelionButton;
