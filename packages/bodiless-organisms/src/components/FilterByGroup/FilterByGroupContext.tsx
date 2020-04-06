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

import React, {
  FC,
  ConsumerProps,
  useContext,
  ComponentType as CT,
} from 'react';
import { Observer } from 'mobx-react';
import {
  TagType,
  WithFilterByGroupOptions,
  FBGContextOptions,
  FBGContextInterface,
} from './types';
import FilterByGroupStore from './FilterByGroupStore';

const defaultFBGStore = new FilterByGroupStore();

class FilterByGroupContext implements FBGContextInterface {
  readonly name: string = 'FilterByGroupContext';

  readonly tags: TagType[] = [];

  readonly parent: FilterByGroupContext | undefined;

  private store: FilterByGroupStore = defaultFBGStore;

  constructor(values?: FBGContextOptions, parent?: FilterByGroupContext) {
    if (values) {
      if (values.name) this.name = values.name;
      if (values.tags) this.tags = values.tags;
    }
    if (parent) {
      this.parent = parent;
      this.store = parent.store;
    }
  }

  static context = React.createContext(
    new FilterByGroupContext() as FBGContextInterface,
  );

  static Consumer: FC<ConsumerProps<FBGContextInterface>> = ({ children }) => (
    <FilterByGroupContext.context.Consumer>
      {value => <Observer>{() => children(value)}</Observer>}
    </FilterByGroupContext.context.Consumer>
  );

  static Provider = FilterByGroupContext.context.Provider;

  spawn(values: FBGContextOptions): FBGContextInterface {
    return new FilterByGroupContext(values, this);
  }
}

const useFilterByGroupContext = () => useContext(FilterByGroupContext.context);

const FilterByGroupProvider: FC<FBGContextOptions> = ({
  name,
  tags,
  children,
}) => {
  const newValue = useFilterByGroupContext().spawn({
    name: name || 'Unknown',
    tags: tags || [],
  });

  return (
    <FilterByGroupContext.Provider value={newValue}>
      {children}
    </FilterByGroupContext.Provider>
  );
};

const withFilterByGroupContext = <P extends object>({
  name,
  tags,
}: WithFilterByGroupOptions<P>) => (Component: CT<P> | string) => (props: P) => (
  <FilterByGroupProvider name={name} tags={tags}>
    <Component {...props} />
  </FilterByGroupProvider>
  );

export default FilterByGroupContext;
export {
  useFilterByGroupContext,
  withFilterByGroupContext,
  FilterByGroupProvider,
};
