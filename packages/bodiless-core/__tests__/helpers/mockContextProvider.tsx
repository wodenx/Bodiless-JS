import React, { FC } from 'react';
import type { Props as PageContextProviderProps } from '../../src/Types/PageContextProviderTypes';
import type { PageEditContextInterface, DefinesLocalEditContext } from '../../src/PageEditContext/types';
import { useEditContext } from '../../src/hooks';
import PageEditContext from '../../src/PageEditContext';

interface PageEditContextClass {
  new (values: DefinesLocalEditContext, parent: PageEditContextInterface): PageEditContextInterface;
}

const mockContextProvider = (Class: PageEditContextClass) => {
  const MockContextProvider: FC<PageContextProviderProps> = ({ children }) => {
    const context = useEditContext();
    const newContext: PageEditContextInterface = new Class({
      getMenuOptions: () => [],
      name: 'mock',
      id: 'mock',
    }, context);
    newContext.spawn = (v: DefinesLocalEditContext) => new Class(v, newContext);
    return (
      <PageEditContext.Provider value={newContext}>
        {children}
      </PageEditContext.Provider>
    );
  };
  return MockContextProvider;
};

export class AlwaysActive extends PageEditContext {
  // eslint-disable-next-line class-methods-use-this
  get isActive() { return true; }
}

export default mockContextProvider;
