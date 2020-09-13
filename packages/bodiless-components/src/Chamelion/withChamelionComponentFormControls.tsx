import React, { ComponentType, FC } from 'react';

import { flowRight } from 'lodash';
import { ChamelionButtonProps } from './types';
import { DEFAULT_KEY } from './withChamelionContext';
import { withUnwrap } from './withChamelionButton';
import { useChamelionContext } from '.';

const withWrapOnSubmit = <P extends object>(Component: ComponentType<P>) => {
  const WithWrapOnSubmit: FC<P & ChamelionButtonProps> = props => {
    const { isOn, setActiveComponent, selectableComponents } = useChamelionContext();
    if (isOn) return <Component {...props} />;
    const newKey = Object.keys(selectableComponents).find(key => key !== DEFAULT_KEY) || null;
    return <Component {...props} onSubmit={() => setActiveComponent(newKey)} />;
  };
  return WithWrapOnSubmit;
};

const withChamelionComponentFormControls = flowRight(
  withWrapOnSubmit,
  withUnwrap,
);

export default withChamelionComponentFormControls;
