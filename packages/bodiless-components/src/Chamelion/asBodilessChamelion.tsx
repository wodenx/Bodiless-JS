import React, { ComponentType } from 'react';
import {
  ifEditable,
  useNode,
} from '@bodiless/core';
import type { WithNodeKeyProps } from '@bodiless/core';
import { flowRight } from 'lodash';
import { UseChamelionOverrides, ChamelionData } from './types';
import withChamelionButton from './withChamelionButton';
import applyChamelion from './applyChamelion';

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

export { withDeleteNodeOnUnwrap };
