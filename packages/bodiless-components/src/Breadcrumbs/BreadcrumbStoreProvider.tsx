/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNode, NodeProvider } from '@bodiless/core';
import type { BreadcrumbStoreType } from './BreadcrumbStore';

const BreadcrumbsStoreContext = React.createContext<BreadcrumbStoreType | undefined>(undefined);

/**
 * Component that adds react context provider containing store to its children.
 */
const BreadcrumbStoreProvider: ComponentType<any> = ({ children, store }: any) => (
  <BreadcrumbsStoreContext.Provider value={store}>{children}</BreadcrumbsStoreContext.Provider>
);

/**
 * React hook to get store.
 */
const useBreadcrumbStore = () => React.useContext(BreadcrumbsStoreContext);

/**
 * Use this HOC to wrap a menu so as to generate data for breadcrumbs
 * and menu trails without producing any markup. This is useful during
 * SSR to ensure that the data are available to menus and breadcrumbs
 * at first render.
 *
 * @example
 * ```js
 * import Menu from 'my-menu-component';
 * const Provider = withBreadcrumbStore(Fragment);
 * const Source = asHiddenBreadcrumbSource(Menu);
 *
 * return (
 *   <Provider>
 *     {process.env.IS_SSR && <Source />}
 *     <Menu />
 *     <Breadcrumbs />
 *   </Provider
 * )
 * ```
 * This example assumes that the items in the `Menu` component have
 * been wrapped in `asBreadcrumb` so they will populate the store.
 * Note also that `process.env.IS_SSR` is standing in for whatever method
 * you choose of determining the render environment.
 *
 * @param Component The component providing the menu data structure.
 *
 * @return A version of the component which renders as null.
 */
const asHiddenBreadcrumbSource = <P extends object>(Component: ComponentType<P>) => {
  const AsHiddenBreadcrumbSource = (props:P) => {
    const store = useBreadcrumbStore();
    const { node } = useNode();
    ReactDOMServer.renderToString(
      <NodeProvider node={node}>
        <BreadcrumbStoreProvider store={store}>
          <Component {...props} />
        </BreadcrumbStoreProvider>
      </NodeProvider>,
    );
    return null;
  };
  return AsHiddenBreadcrumbSource;
};

export {
  useBreadcrumbStore,
  BreadcrumbStoreProvider,
  asHiddenBreadcrumbSource,
};
