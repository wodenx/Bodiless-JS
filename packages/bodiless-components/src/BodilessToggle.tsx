import React, { ComponentType } from 'react';
import {
  ifToggledOff, ifToggledOn, withBodilessData, withSidecarNodes,
  WithNodeKeyProps, startSidecarNodes, endSidecarNodes, EditButtonProps,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { withoutProps, HOC } from '@bodiless/fclasses';

type ToggleProps = {
  onSubmit?: () => void,
  unwrap?: () => void,
};

type ToggleData = {
  on: boolean,
};

const useDataToggle = <P extends object>(props: P & EditButtonProps<ToggleData>) => {
  const { componentData } = props;
  const { on } = componentData;
  return Boolean(on);
};

/**
 * @private
 *
 * HOC which adds props to enhance a component form so that can switch the toggle
 * When toggle is on, it adds an "unwrap" prop (which the component form can use to render a
 * "remove ..." link). When toggle is off, it adds a submit handler which will turn the toggle
 * on when submitted.
 */
const withComponentFormToggle$ = <P extends object>(Component: ComponentType<P & ToggleProps>) => {
  const WithComponentFormToggle = (props: P & EditButtonProps<ToggleData>) => {
    const { setComponentData } = props;
    const newProps = useDataToggle(props)
      ? { unwrap: () => setComponentData({ on: false }) }
      : { onSubmit: () => setComponentData({ on: true }) };
    return <Component {...props} {...newProps} />;
  };
  return WithComponentFormToggle;
};

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
) => withSidecarNodes(
  withBodilessData(nodeKeys, defaultData),
  withComponentFormToggle$,
  withoutProps(['componentData', 'setComponentDtaa']),
);

type ToggleHook<P> = (props: P) => boolean;
type ToggleFunc<P> = (hook: ToggleHook<P>) => HOC;
type Flow = (...hocs: HOC[]) => HOC;
type HOCToggle<P> = (hook: ToggleHook<P>) => Flow;

const ifBodilessToggle$ = <P extends object>(toggleFunc: ToggleFunc<P>) => (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => flowRight(
  startSidecarNodes,
  withBodilessData(nodeKeys, defaultData),
  toggleFunc(useDataToggle as ToggleHook<P>),
);

/**
 * @private
 *
 * Core for ifBodilessToggleOn and ifBodilessToggleOff
 */
const ifBodilessToggleFlowRight = <P extends object>(toggle: HOCToggle<P>) => (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => (...hocs: HOC[]) => {
  const toggleFunc = (hook: ToggleHook<P>) => toggle(hook)(
    endSidecarNodes as HOC,
    ...hocs,
  );
  return ifBodilessToggle$(toggleFunc)(nodeKeys, defaultData);
};

const ifBodilessToggle = <P extends object>(toggle: ToggleFunc<P>) => (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => {
  const toggleFunc = (hook: ToggleHook<P>) => flowRight(
    endSidecarNodes,
    toggle(hook),
  );
  return ifBodilessToggle$(toggleFunc)(nodeKeys, defaultData);
};

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
const ifBodilessTogggleOn = ifBodilessToggleFlowRight(ifToggledOn as HOCToggle<any>);

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
const ifBodilessToggleOff = ifBodilessToggleFlowRight(ifToggledOff as HOCToggle<any>);

export {
  ifBodilessToggle,
  ifBodilessToggleOff,
  ifBodilessTogggleOn,
  withBodilessComponentFormToggle,
};
