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
  FBGContextOptions,
  FBGContextInterface,
} from './types';
import FilterByGroupStore from './FilterByGroupStore';

const defaultFBGStore = new FilterByGroupStore();

class FilterByGroupContext implements FBGContextInterface {
  readonly defaultSuggestions: TagType[] = [];

  private store: FilterByGroupStore = defaultFBGStore;

  static context = React.createContext(
    new FilterByGroupContext() as FBGContextInterface,
  );

  static Consumer: FC<ConsumerProps<FBGContextInterface>> = ({ children }) => (
    <FilterByGroupContext.context.Consumer>
      {value => <Observer>{() => children(value)}</Observer>}
    </FilterByGroupContext.context.Consumer>
  );

  static Provider = FilterByGroupContext.context.Provider;

  constructor(values?: FBGContextOptions) {
    if (values && values.suggestions) {
      this.defaultSuggestions = values.suggestions;
    }

    this.defaultSuggestions.forEach(subbestion => this.store.addTag(subbestion));
  }

  /* eslint-disable class-methods-use-this */
  spawn(values: FBGContextOptions): FBGContextInterface {
    return new FilterByGroupContext(values);
  }

  setSelectedTag(tag?: TagType) {
    this.store.setSelectedTag(tag);
  }

  addTag(tag: TagType) {
    this.store.addTag(tag);
  }

  get selectedTag() {
    return this.store.selectedTag;
  }

  get allTags() {
    return this.store.tags;
  }

  refresh() {
    this.store.setActiveContext(this);
  }
}

const useFilterByGroupContext = () => useContext(FilterByGroupContext.context);

const FilterByGroupProvider: FC<FBGContextOptions> = ({
  children,
  suggestions,
}) => {
  const newValue = useFilterByGroupContext().spawn({ suggestions });

  return (
    <FilterByGroupContext.Provider value={newValue}>
      {children}
    </FilterByGroupContext.Provider>
  );
};

type WithFilterByGroupOptions<P> = {
  suggestions?: TagType[],
};

const withFilterByGroupContext = <P extends object>({
  suggestions,
}: WithFilterByGroupOptions<P>) => (Component: CT<P> | string) => (props: P) => (
  <FilterByGroupProvider suggestions={suggestions}>
    <Component {...props} />
  </FilterByGroupProvider>
  );

export default FilterByGroupContext;
export {
  useFilterByGroupContext,
  withFilterByGroupContext,
  FilterByGroupProvider,
};
