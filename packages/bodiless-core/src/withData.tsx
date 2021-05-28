/**
 * Copyright © 2019 Johnson & Johnson
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

import React from 'react';
import { HOC } from '@bodiless/fclasses';
import identity from 'lodash/identity';

export type HasDataProp<D> = {
  componentData: D;
  mapDataToProps?: (data: D) => D,
};

/**
 * Spreads data from the `componentData` prop to the props of the wrapped component.
 *
 * Also nhances the wrapped component with a 'mapDataToProps' prop, which accepts
 * a processing function to be applied to the `componentData`prop before
 * spreading. This is useful if you want to perform final processing of the data
 * before passing it to the component.
 *
 * @param Component
 * The component which will receive the componentData as props.
 *
 * @return
 * A component which accepts additional `componentData` and `mapDataToProps` props
 * which are used to generate props for the original component.
 */
const withData: HOC<{}, HasDataProp<any>> = Component => {
  const WithData = ({ componentData, mapDataToProps = identity, ...rest }: HasDataProp<any>) => (
    <Component {...rest} {...mapDataToProps(componentData)} />
  );
  return WithData;
};

export default withData;
