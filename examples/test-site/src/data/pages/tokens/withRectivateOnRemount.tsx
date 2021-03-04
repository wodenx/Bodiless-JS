import React, { FC, ComponentType } from 'react';
import { useEditContext, useActivateOnEffect, useActivateOnEffectActivator } from '@bodiless/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 } from 'uuid';

export const useRectivateOnRemount = (uuid: string) => {
  const context = useEditContext();
  const { setId } = useActivateOnEffect();
  if (context.isInnermost) setId(uuid);
  useActivateOnEffectActivator(uuid);
};
const withReactivateOnRemount = (
  uuid: string = v4(),
) => <P extends object>(Component: ComponentType<P>) => {
  const WithReactivateOnRemount: FC<P> = props => {
    useRectivateOnRemount(uuid);
    return <Component {...props} />;
  };
  return WithReactivateOnRemount;
};

export default withReactivateOnRemount;
