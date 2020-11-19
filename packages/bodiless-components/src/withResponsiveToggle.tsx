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

import React, { ComponentType, useEffect, useState } from 'react';
import { ifToggledOn, ifToggledOff } from '@bodiless/core';
import { usePageDimensionsContext } from './PageDimensionsProvider';

const useResponsiveToggle = (sizes: string[] | string) => () => {
  const { size } = usePageDimensionsContext();
  return Array.isArray(sizes) ? sizes.includes(size) : sizes === size;
};

/**
 * Flow toggle which applies the supplied hocs if the viewport matches a specified
 * set of sizes.
 *
 * @param sizes A list of viewport sizes as defined by the `PageDimensionContext`
 */
const ifViewportIs = (sizes: string[] | string) => ifToggledOn(useResponsiveToggle(sizes));

/**
 * Flow toggle which applies the supplied hocs if the viewport does not match
 * a specified set of sizes.
 *
 * @param sizes A list of viewport sizes as defined by the `PageDimensionContext`
 */
const ifViewportIsNot = (sizes: string[] | string) => ifToggledOff(useResponsiveToggle(sizes));

/**
 * Helper hoc which removes the wrapped component on effect. Useful to remove a component
 * from the browser DOM at certain viewports, but still render the component during SSR
 * (to prevent problems with DOM reconciliation and flicker).
 *
 * @param Component The component to remove
 */
const withRemoveOnEffect = <P extends object>(Component: ComponentType<P>) => {
  const WithRemoveOnEffect = (props: P) => {
    const [hidden, setHidden] = useState(false);
    useEffect(() => setHidden(true), []);
    return hidden ? null : <Component {...props} />;
  };
  return WithRemoveOnEffect;
};

export {
  ifViewportIs,
  ifViewportIsNot,
  withRemoveOnEffect,
};
