import React, { ComponentType, Fragment } from 'react';
import {
  withBodilessData, withSidecarNodes,
  withMenuOptions, useContextMenuForm, useEditFormProps,
  useMenuOptionUI,
  WithNodeKeyProps,
} from '@bodiless/core';

import { flowRight } from 'lodash';
import { withoutProps } from '@bodiless/fclasses';
import { ChamelionButtonProps, UseChamelionOverrides, ChamelionData } from './types';
import {
  useActiveKey, DEFAULT_KEY, useIsOn, useSelectableComponents,
} from './hooks';
import { applyChamelionDesign } from './applyChamelion';

const useToggleButtonMenuOption = (props: ChamelionButtonProps) => {
  const { setComponentData, components } = props;
  const activeKey = useActiveKey(props);
  const newKey = activeKey === DEFAULT_KEY
    ? Object.keys(components).find(key => key !== DEFAULT_KEY) || null
    : null;
  return {
    label: 'Toggle',
    icon: useIsOn(props) ? 'toggle-on' : 'toggle-off',
    handler: () => setComponentData({ component: newKey }),
  };
};
const useSwapButtonMenuOption = (props: ChamelionButtonProps) => {
  const components = useSelectableComponents(props);
  const renderForm = () => {
    const {
      ComponentFormLabel,
      ComponentFormRadioGroup,
      ComponentFormRadio,
      ComponentFormTitle,
    } = useMenuOptionUI();
    const radios = Object.getOwnPropertyNames(components).map(name => (
      <ComponentFormLabel key={name} htmlFor={`bl-component-form-chamelion-radio-${name}`}>
        <ComponentFormRadio value={name} id={`bl-comonent-form-chamelion-radio-${name}`} />
        {/* @ts-ignore */}
        {components[name].title}
      </ComponentFormLabel>
    ));
    return (
      <div>
        <ComponentFormTitle>Choose a component</ComponentFormTitle>
        <ComponentFormRadioGroup field="component">
          {radios}
        </ComponentFormRadioGroup>
      </div>
    );
  };
  const render = useContextMenuForm(useEditFormProps({ ...props, renderForm }));
  return {
    icon: 'Swap',
    label: 'Swap',
    handler: () => render,
  };
};

export const withUnwrap = <P extends object>(Component: ComponentType<P>) => {
  const WithUnwrapChamelion = (props: P & ChamelionButtonProps) => {
    const { setComponentData } = props;
    if (!useIsOn(props)) return <Component {...props} />;
    const unwrap = () => setComponentData({ component: null });
    return <Component {...props} unwrap={unwrap} />;
  };
  return WithUnwrapChamelion;
};

const withChamelionButton$ = <P extends ChamelionButtonProps>(
  useOverrides?: UseChamelionOverrides) => {
  const useMenuOptions = (props: P) => {
    const extMenuOptions = Object.keys(useSelectableComponents(props)).length > 1
      ? useSwapButtonMenuOption
      : useToggleButtonMenuOption;
    const baseDefinition = {
      name: 'chamelion-toggle',
      global: false,
      local: true,
      ...extMenuOptions(props),
    };
    const overrides = useOverrides ? useOverrides(props) : {};
    // if useOverrides returns undefined, it means not to provide the button.
    return typeof overrides !== 'undefined' ? [{ ...baseDefinition, ...overrides }] : [];
  };
  return withMenuOptions({ useMenuOptions, name: 'Chamelion' });
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
const withChamelionButton = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: UseChamelionOverrides,
) => flowRight(
  // We apply the design to a fragment bc at this point we just need the keys.
  applyChamelionDesign(Fragment),
  withSidecarNodes(
    withBodilessData(nodeKeys, defaultData),
    withChamelionButton$(useOverrides),
    withUnwrap,
  ),
  // We remove the 'components' prop so as not to interfere with other designs.
  withoutProps('components'),
);

export default withChamelionButton;
