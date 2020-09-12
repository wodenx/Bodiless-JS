import React, { ComponentType, FC } from 'react';
import { withBodilessData, withSidecarNodes, WithNodeKeyProps } from '@bodiless/core';

import { flowRight, omit } from 'lodash';
import {
  extendDesignable, asComponent, applyDesign, Design,
} from '@bodiless/fclasses';
import { ChamelionButtonProps, ChamelionData } from './types';
import { DEFAULT_KEY, useActiveComponent } from './hooks';

/**
 * @private
 *
 * HOC makes the wrapped component designable, ensuring that there is a component
 * for every key in the design.
 *
 * @param Component
 */
const applyChamelionDesign = <P extends object>(Component: ComponentType<P> | string) => {
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
  Component: ComponentType<P> | string) => {
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

export default applyChamelion;

export { applyChamelionDesign };
