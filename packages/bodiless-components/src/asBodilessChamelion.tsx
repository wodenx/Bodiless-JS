import React, { ComponentType, FC, Fragment } from 'react';
import {
  withBodilessData, withSidecarNodes,
  withMenuOptions, useContextMenuForm, useEditFormProps,
  useMenuOptionUI,
  TMenuOption,
  ifEditable,
  useNode,
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
const withDeleteNodeOnUnwrap = <P extends object>(Component: ComponentType<P>|string) => {
  const WithDeleteOnUnwrap = (props: P) => {
    const { node } = useNode();
    const { unwrap, ...rest } = props as { unwrap?: () => void };
    if (!unwrap) return <Component {...props} />;
    const unwrap$ = () => {
      node.delete();
      if (unwrap) unwrap();
    };
    return <Component {...rest as P} unwrap={unwrap$} />;
  };
  return WithDeleteOnUnwrap;
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

const withUnwrap = <P extends object>(Component: ComponentType<P>) => {
  const WithUnwrapChamelion = (props: P & ChamelionButtonProps) => {
    const { setComponentData } = props;
    if (!useIsOn(props)) return <Component {...props} />;
    const unwrap = () => setComponentData({ component: null });
    return <Component {...props} unwrap={unwrap} />;
  };
  return WithUnwrapChamelion;
};
const withWrapOnSubmit = <P extends object>(Component: ComponentType<P>) => {
  const WithWrapOnSubmit: FC<P & ChamelionButtonProps> = props => {
    if (useIsOn(props)) return <Component {...props} />;
    const { components, setComponentData } = props;
    const newKey = Object.keys(components).find(key => key !== DEFAULT_KEY) || null;
    return <Component {...props} onSubmit={() => setComponentData({ component: newKey })} />;
  };
  return WithWrapOnSubmit;
};

/**
 * @private
 *
 * HOC makes the wrapped component designable, ensuring that there is a component
 * for every key in the design.
 *
 * @param Component
 */
const applyChamelionDesign = <P extends object>(Component: ComponentType<P>|string) => {
  const apply = (design: Design<any> = {}) => {
    const Component$ = asComponent(Component as ComponentType<P>);
    const start = Object.keys(design).reduce((acc, key) => ({
      ...acc,
      [key]: Component$,
    }), { [DEFAULT_KEY]: Component$ });
    return applyDesign(start)(design);
  };
  return extendDesignable()(apply);
};

/**
 * Applies the appropriate design to the wrapped component depending on the
 * chamelion state.
 *
 * Use this function when you want to separate the form controlling the chamelion
 * state from the component on which the chamelion acts (for example, if you want
 * to add controls to a component edit form, but actually act on the component
 * to which the edit form was added, eg:
 *
 * ```
 * flow(
 *   applyChamelion('link-chamelion'),
 *   asBodilessLink('link')
 *   withChamelionComponenFormConrols('link-chamelion')
 *   withDesign({
 *     Disabled: flow(replaceWith('span'), withoutProps('href'))
 *   }),
 * )('a');
 * ```
 *
 * @param nodeKeys Location of the chamelion state data.
 * @param defaultData Default chamelion state.
 *
 * @return HOC which applies the appropriate HOC's
 */
const applyChamelion = (
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
    ),
  )(Chamelion);
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

const withChamelionComponentFormControls = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
) => flowRight(
  // We apply the design to a fragment bc at this point we just need the keys.
  applyChamelionDesign(Fragment),
  withSidecarNodes(
    withBodilessData(nodeKeys, defaultData),
    withWrapOnSubmit,
    withUnwrap,
  ),
  withoutProps('components', 'componentData', 'setComponentData'),
);

const asBodilessChamelion = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: UseChamelionOverrides,
) => flowRight(
  ifEditable(
    withChamelionButton(nodeKeys, defaultData, useOverrides),
  ),
  applyChamelion(nodeKeys, defaultData),
);

export default asBodilessChamelion;
export {
  applyChamelion,
  withChamelionButton,
  withChamelionComponentFormControls,
  withDeleteNodeOnUnwrap,
};
