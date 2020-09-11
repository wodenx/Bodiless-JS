import React, { ComponentType, FC, Fragment } from 'react';
import {
  withBodilessData, withSidecarNodes,
  withMenuOptions, useContextMenuForm, useEditFormProps,
  useMenuOptionUI,
  TMenuOption,
  ifEditable,
} from '@bodiless/core';
import type { WithNodeKeyProps, EditButtonProps } from '@bodiless/core';
import { flowRight, pick, omit } from 'lodash';
import {
  extendDesignable, DesignableComponentsProps,
  asComponent, DesignableComponents, applyDesign, Design, withoutProps,
} from '@bodiless/fclasses';

const DEFAULT_KEY = '_default';

export type ChamelionData = {
  component?: string|null,
};

type ChamelionComponents = DesignableComponents & {
  DEFAULT_KEY: ComponentType<any>,
};

export type ChamelionProps =
  EditButtonProps<ChamelionData> & DesignableComponentsProps<ChamelionComponents>;

type ChamelionButtonProps = ChamelionProps & EditButtonProps<ChamelionData>;

type UseOverrides<P> = (props: P) => Partial<TMenuOption>;
type UseChamelionOverrides = UseOverrides<ChamelionButtonProps>;

const useSelectableComponents = (props: ChamelionButtonProps) => {
  const { components } = props;
  // @ts-ignore @TODO need to add metadata to component type
  const keys = Object.keys(components).filter(key => Boolean(components[key].title));
  return pick(components, keys);
};

const useActiveKey = (props: ChamelionButtonProps) => {
  const { componentData: { component }, components } = props;
  return (component && components[component]) ? component : DEFAULT_KEY;
};

const useActiveComponent = (props: ChamelionButtonProps) => {
  const { components } = props;
  return components[useActiveKey(props)];
};

const useIsOn = (props: ChamelionButtonProps) => useActiveKey(props) !== DEFAULT_KEY;

const useToggleButtonMenuOption = (props: ChamelionButtonProps) => {
  const { setComponentData } = props;
  const components = useSelectableComponents(props);
  const activeKey = useActiveKey(props);
  const keys = Object.keys(components);
  const newKey = keys.find(key => key !== activeKey) || null;
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
        {/* @ts-ignore @TODO Fix this, components need to have attributes */}
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

const withChamelionButton$ = <P extends ChamelionButtonProps>(
  useOverrides?: UseChamelionOverrides,
) => {
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

const withUnwrapChamelion = <P extends object>(Component: ComponentType<P>) => {
  const WithUnwrapChamelion = (props: P & ChamelionButtonProps) => {
    const { setComponentData } = props;
    if (!useIsOn(props)) return <Component {...props} />;
    const unwrap = () => setComponentData({ component: null });
    return <Component {...props} unwrap={unwrap} />;
  };
  return WithUnwrapChamelion;
};

const applyChamelionDesign = <P extends object>(Component: ComponentType<P>|string) => {
  const apply = (design: Design<any>) => {
    const Component$ = asComponent(Component as ComponentType<P>);
    const start = Object.keys(design).reduce((acc, key) => ({
      ...acc,
      [key]: Component$,
    }), { [DEFAULT_KEY]: Component$ });
    return applyDesign(start)(design);
  };
  return extendDesignable()(apply);
};

const applyBodilessChamelion = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
) => <P extends object>(
  Component: ComponentType<P>|string,
) => {
  const Chamelion: FC<P & ChamelionButtonProps> = props => {
    const ActiveComponent = useActiveComponent(props);
    const rest = omit(props, 'componentData', 'setComponentData', 'components');
    return <ActiveComponent {...rest as P} />;
  };
  return flowRight(
    applyChamelionDesign(Component),
    withSidecarNodes(
      withBodilessData(nodeKeys, defaultData),
      withUnwrapChamelion,
    ),
  )(Chamelion);
};

const withBodilessChamelionButton = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: UseChamelionOverrides,
) => flowRight(
  applyChamelionDesign(Fragment),
  withSidecarNodes(
    withBodilessData(nodeKeys, defaultData),
    ifEditable(
      withChamelionButton$(useOverrides),
    ),
    withUnwrapChamelion,
  ),
  withoutProps('components'),
);

const asBodilessChamelion = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: UseChamelionOverrides,
) => flowRight(
  withBodilessChamelionButton(nodeKeys, defaultData, useOverrides),
  applyBodilessChamelion(nodeKeys, defaultData),
);

export default asBodilessChamelion;
