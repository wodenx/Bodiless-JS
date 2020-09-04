import React, { ComponentType, Fragment } from 'react';
import {
  ifToggledOff, ifToggledOn, withNode, withSidecarNodes,
  WithNodeKeyProps, withNodeKey, withNodeDataHandlers, AsBodiless,
  startSidecarNodes, endSidecarNodes, ifReadOnly, ifEditable, withOnlyProps,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { replaceWith, asComponent, withoutProps } from '@bodiless/fclasses';

type NodeDataHandlers<D> = {
  setComponentData: (data: D) => void,
  componentData: D,
};

type ToggleProps = {
  onSubmit?: () => void,
  unwrap?: () => void,
};

type ToggleData = {
  on: boolean,
};

type AsBodilessToggle = AsBodiless<any, ToggleData>;

const useDataToggle = <P extends object>(props: P & NodeDataHandlers<ToggleData>) => {
  const { componentData } = props;
  const { on } = componentData;
  return Boolean(on);
};

const withBodilessData = <P extends object, D extends object>(
  nodeKey?: WithNodeKeyProps,
  defaultData?: D,
) => flowRight(
    withNodeKey(nodeKey),
    withNode,
    withNodeDataHandlers(defaultData),
  );

/**
 * @private
 *
 * HOC which adds props to enhance a component form so that can switch the toggle
 * When toggle is on, it adds an "unwrap" prop (which the component form can use to render a
 * "remove ..." link). When toggle is off, it adds a submit handler which will turn the toggle
 * on when submitted.
 */
const withComponentFormToggle$ = <P extends object>(Component: ComponentType<P & ToggleProps>) => {
  const WithComponentFormToggle = (props: P & NodeDataHandlers<ToggleData>) => {
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
export const withBodilessComponentFormToggle = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => withSidecarNodes(
  withBodilessData(nodeKeys, defaultData),
  withComponentFormToggle$,
  withoutProps(['componentData', 'setComponentDtaa']),
);

/**
 * @private
 */
const ifBodilessToggle = (on: boolean) => (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ToggleData,
) => (...hocs: HOC[]) => {
  const toggleFunc = on ? ifToggledOn : ifToggledOff;
  return flowRight(
    startSidecarNodes,
    withBodilessData(nodeKeys, defaultData),
    toggleFunc(useDataToggle)(
      endSidecarNodes,
      ...hocs,
    ),

  );
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
export const ifBodilessTogggleOn = ifBodilessToggle(true);

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
export const ifBodilessToggleOff = ifBodilessToggle(false);

const SafeFragment = withOnlyProps('key', 'children')(Fragment);
const Span = asComponent('span');

type HOC<P = any, Q = any> = (Component: ComponentType<P>|string) => ComponentType<Q>;

const withBodilessLinkToggle = (asLink: HOC) => flowRight(
  withBodilessComponentFormToggle('toggle'),
  withSidecarNodes(
    asLink,
  ),
  ifBodilessToggleOff('toggle')(
    ifEditable(replaceWith(Span)),
    ifReadOnly(replaceWith(SafeFragment)),
  ),
);

export default withBodilessLinkToggle;
