import React, { ComponentType, FC, Fragment } from 'react';
import { withBodilessData, withSidecarNodes, WithNodeKeyProps } from '@bodiless/core';

import { flowRight } from 'lodash';
import { withoutProps } from '@bodiless/fclasses';
import { ChamelionButtonProps, ChamelionData } from './types';
import { DEFAULT_KEY, useIsOn } from './hooks';
import { withUnwrap } from './withChamelionButton';
import { applyChamelionDesign } from './applyChamelion';

const withWrapOnSubmit = <P extends object>(Component: ComponentType<P>) => {
  const WithWrapOnSubmit: FC<P & ChamelionButtonProps> = props => {
    if (useIsOn(props)) return <Component {...props} />;
    const { components, setComponentData } = props;
    const newKey = Object.keys(components).find(key => key !== DEFAULT_KEY) || null;
    return <Component {...props} onSubmit={() => setComponentData({ component: newKey })} />;
  };
  return WithWrapOnSubmit;
};

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

export default withChamelionComponentFormControls;
