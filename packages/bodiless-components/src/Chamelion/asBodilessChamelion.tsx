import React, { ComponentType } from 'react';
import {
  ifEditable,
  useNode,
} from '@bodiless/core';
import type { WithNodeKeyProps } from '@bodiless/core';
import { flowRight } from 'lodash';
import { ChamelionData, UseOverrides } from './types';
import withChamelionButton from './withChamelionButton';
import applyChamelion from './applyChamelion';
import withChamelionContext from './withChamelionContext';

const withDeleteNodeOnUnwrap = <P extends object>(Component: ComponentType<P> | string) => {
  const WithDeleteOnUnwrap = (props: P) => {
    const { node } = useNode();
    const { unwrap, ...rest } = props as { unwrap?: () => void; };
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
 * Transforms the wrapped component into a "chamelion".  The chamelion accepts a design and
 * applies one of the design elements to itself depending on the chamelion state, which
 * is stored as bodiless data. A menu option is provided on the local context menu which
 * renders a form allowing the user to select one of the design element alternatives.
 *
 * @param nodeKeys Location where the chamelion state data should be stored.
 * @param defaultData Default chamelion state.
 * @param useOverrides Hook returning overrides for the menu button.
 */
const asBodilessChamelion = (
  nodeKeys: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: UseOverrides,
) => flowRight(
  withChamelionContext(nodeKeys, defaultData),
  ifEditable(
    withChamelionButton(useOverrides),
  ),
  applyChamelion,
);

export default asBodilessChamelion;

export { withDeleteNodeOnUnwrap };
