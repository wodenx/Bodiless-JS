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

    this.defaultSuggestions.forEach(suggestion => this.store.addTag(suggestion));
  }

  /* eslint-disable class-methods-use-this */
  spawn(values: FBGContextOptions): FBGContextInterface {
    return new FilterByGroupContext(values);
  }

  setSelectedTag(tag?: TagType, nodeId?: string) {
    this.store.setSelectedTag(tag, nodeId);
  }

  addTag(tag: TagType) {
    this.store.addTag(tag);
  }

  get selectedTag() {
    return this.store.selectedTag;
  }

  get selectedNode() {
    return this.store.selectedNodeId;
  }

  get allTags() {
    // Sort alphabetically
    return this.store.tags.slice().sort((a, b) => a.name.localeCompare(b.name));
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

const withFilterSuggestions = <P extends object>({
  suggestions,
}: FBGContextOptions) => (Component: CT<P> | string) => (props: P) => (
  <Component {...props} suggestions={suggestions} />);

const withFilterByGroupContext = <P extends object>(
  Component: CT<P> | string,
) => (props: P & FBGContextOptions) => {
    const { suggestions } = props;

    return (
      <FilterByGroupProvider suggestions={suggestions}>
        <Component {...props} />
      </FilterByGroupProvider>
    );
  };

export default FilterByGroupContext;
export {
  FilterByGroupProvider,
  useFilterByGroupContext,
  withFilterByGroupContext,
  withFilterSuggestions,
};
