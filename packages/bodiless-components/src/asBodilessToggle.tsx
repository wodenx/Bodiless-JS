import React, { ComponentType } from 'react';
import {
  ifToggledOff, ifToggledOn, withBodilessData, withSidecarNodes,
  startSidecarNodes, endSidecarNodes, withMenuOptions, useNode,
} from '@bodiless/core';
import type { WithNodeKeyProps, EditButtonProps, TMenuOption } from '@bodiless/core';
import { flowRight } from 'lodash';
import type { HOC } from '@bodiless/fclasses';
import { withoutProps } from '@bodiless/fclasses';
import { MenuOptionsDefinition } from '@bodiless/core/lib/Types/PageContextProviderTypes';

type ToggleProps = {
  onSubmit?: () => void,
  unwrap?: () => void,
};

type ToggleData = {
  on: boolean,
};

/**
 * Use this hook to get the value of the current bodiless toggle. Only valid in a component
 * created by a HOC which is wrapped in `asBodilessToggle`, `ifBodilessToggleOn`,
 * ifBodilessToggle off, or in the useOverrides hook provided to `withBodilessToggleButton`
 *
 * @param props The props passed to the component.
 *
 * @return A boolean indicating whether the toggle is "on".
 */
const useBodilessToggle = <P extends object>(props: P & EditButtonProps<ToggleData>) => {
  const { componentData } = props;
  const { on } = componentData;
  return Boolean(on);
};

type ToggleButtonProps = EditButtonProps<ToggleData>;

/**
 * @private
 *
 * HOC which adds props to enhance a component form so that can switch the toggle
 * When toggle is on, it adds an "unwrap" prop (which the component form can use to render a
 * "remove ..." link). When toggle is off, it adds a submit handler which will turn the toggle
 * on when submitted.
 */
const withToggleProps = (wrap = 'wrap', unwrap = 'unwrap') => (
  <P extends object>(Component: ComponentType<P & ToggleProps>) => {
    const WithToggleProps = (props: P & EditButtonProps<ToggleData>) => {
      const { setComponentData } = props;
      const newProps = useBodilessToggle(props)
        ? { [unwrap]: () => setComponentData({ on: false }) }
        : { [wrap]: () => setComponentData({ on: true }) };
      return <Component {...props} {...newProps} />;
    };
    return WithToggleProps;
  }
);

const withBodilessToggleButton$ = <P extends ToggleButtonProps>(
  useOverrides?: (props: P) => Partial<MenuOptionsDefinition<P>>,
) => {
  const useMenuOptions = (props: P) => {
    const on = useBodilessToggle(props);
    const { setComponentData } = props;
    const baseDefinition = {
      name: 'toggle',
      icon: on ? 'toggle_on' : 'toggle_off',
      isActive: on,
      label: 'Toggle',
      global: false,
      local: true,
      handler: () => setComponentData({ on: !on }),
    };
    if (!useOverrides) return [baseDefinition];
    return [{ ...baseDefinition, ...useOverrides(props) }];
  };
  return withMenuOptions({ useMenuOptions, name: 'Toggle' });
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

/**
 * Provides a toggle button on the local context menu which can be used to turn on and
 * off a bodiless toggle.
 *
 * @param nodeKeys Define where the toggle data are stored. These will be a sidecar to the
 *        wrapped component
 * @param defaultData Optional default value for the toggle
 * @param useOverrides Optional menu button overrides.  See `asBodilessComponent` in
 *        @bodiless/core for more information.
 */
const withBodilessToggleButton = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
  useOverrides?: (props: ToggleButtonProps) => Partial<TMenuOption>,
): HOC => withSidecarNodes(
  withBodilessData(nodeKeys, defaultData),
  withBodilessToggleButton$(useOverrides),
  withToggleProps('wrap', 'unwrap'),
  withoutProps(['componentData', 'setComponentData']),
);

/**
 * Creates an HOC which adds props to enhance a component form so that can exercize a bodiless
 * toggle (usually to add/remove the component).
 *
 * When toggle is on, it adds an "unwrap" prop (which the component form can use to render a
 * "remove ..." link). When toggle is off, it adds a submit handler which will turn the toggle
 * on when submitted.
 *
 * This function has the usual 'AsBodiless' signature (it accepts nodekeys and default data). Note
 * that it will use a sidecar node to store the toggle data.
 *
 * @param nodeKey The sidecar node key to use to locate the toggle data
 * @param defautlData The default value for the toggle.
 */
const withBodilessComponentFormToggle = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
): HOC => withSidecarNodes(
  withBodilessData(nodeKeys, defaultData),
  withToggleProps('onSubmit', 'unwrap'),
  withoutProps(['componentData', 'setComponentDtaa']),
);

type ToggleHook<P> = (props: P) => boolean;
type ConditionalHOC<P> = (hook: ToggleHook<P>) => HOC;

const asBodilessToggle$ = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => (...hocs: HOC[]) => flowRight(
  startSidecarNodes,
  withBodilessData(nodeKeys, defaultData),
  ...hocs,
);

/**
 * Apply this to a conditional HOC to supply a condition based on the value of a bodiless toggle.
 * @param conditionalHoc A function accepting a predicate and returning an HOC which uses the value
 *        of that predicate.
 *
 * @return An "asBodiless" function which returns the
 */
const asBodilessToggle = <P extends object>(conditionalHoc: ConditionalHOC<P>) => (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
): HOC => asBodilessToggle$(nodeKeys, defaultData)(
  // @TODO Figure out how to get rid of these casts.
  conditionalHoc(useBodilessToggle as ToggleHook<P>),
  withoutProps('componentData', 'setComponentData'),
  endSidecarNodes as HOC,
);

/**
 * Generates an HOC which Applies a set of other HOC's conditionally based on the current state
 * of a bodiless toggle.
 *
 * This function has the usual 'AsBodiless' signature (it accepts nodekeys and default data). Note
 * that it will use a sidecar node to retrieve the toggle data.
 *
 * @param nodeKey The sidecar node key to use to locate the toggle data
 * @param defautlData The default value for the toggle.
 *
 * @return A conditional HOC wrapper, which accepts a list of HOC's to apply if the toggle is on.
 */
const ifBodilessTogggleOn = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => (...hocs: HOC[]) => asBodilessToggle$(nodeKeys, defaultData)(
  ifToggledOn(useBodilessToggle)(
    withoutProps('componentData', 'setComponentData'),
    endSidecarNodes,
    ...hocs,
  ),
  ifToggledOff(useBodilessToggle)(
    withoutProps('componentData', 'setComponentData'),
    endSidecarNodes,
  ),
);

/**
 * Generates an HOC which Applies a set of other HOC's conditionally based on the current state
 * of a bodiless toggle.
 *
 * This function has the usual 'AsBodiless' signature (it accepts nodekeys and default data). Note
 * that it will use a sidecar node to retrieve the toggle data.
 *
 * @param nodeKey The sidecar node key to use to locate the toggle data
 * @param defautlData The default value for the toggle.
 *
 * @return A conditional HOC wrapper, which accepts a list of HOC's to apply if the toggle is of.
 *
 * @example
 * ```with
 * const EnhancedComponent = ifBodilessToggleOn(
 *   addClasses()
 *   )
 */
const ifBodilessToggleOff = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => (...hocs: HOC[]) => asBodilessToggle$(nodeKeys, defaultData)(
  ifToggledOff(useBodilessToggle)(
    withoutProps('componentData', 'setComponentData'),
    endSidecarNodes,
    ...hocs,
  ),
  ifToggledOn(useBodilessToggle)(
    withoutProps('componentData', 'setComponentData'),
    endSidecarNodes,
  ),
);

export default asBodilessToggle;
export {
  ifBodilessToggleOff,
  ifBodilessTogggleOn,
  withBodilessComponentFormToggle,
  withBodilessToggleButton,
  useBodilessToggle,
  withDeleteNodeOnUnwrap,
};
