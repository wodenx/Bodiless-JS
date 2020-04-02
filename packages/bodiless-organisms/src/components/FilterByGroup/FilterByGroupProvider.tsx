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
  ComponentType as CT,
  useContext,
  useState,
} from 'react';
import { reject } from 'lodash';

type Tag = {
  id: string,
  name: string,
};

type FilterByGroupContext = {
  tags: Tag[],
  selectedTag?: string,
  updateSelectedTag: React.Dispatch<React.SetStateAction<string>>,
  updateTags: React.Dispatch<React.SetStateAction<Tag[]>>,
  deleteTag: (string?: string) => void,
};

const defaultContext: FilterByGroupContext = {
  tags: [],
  updateSelectedTag: () => '',
  updateTags: () => [],
  deleteTag: () => null,
};

const FilterByGroupContext = React.createContext<FilterByGroupContext>(defaultContext);
const useFilterByGroupContext = () => useContext(FilterByGroupContext);

const FilterByGroupProvider: FC = ({ children }) => {
  const defaultTags = [
    { id: 'group-item-1', name: 'group-item-1' },
    { id: 'group-item-2', name: 'group-item-2' },
    { id: 'group-item-3', name: 'group-item-3' },
  ];

  const [tags, updateTags] = useState([...defaultTags]);
  const [selectedTag, updateSelectedTag] = useState('');

  const deleteTag = (id?: string) => updateTags(reject(tags, tag => tag.id === id));

  const providerValue: FilterByGroupContext = {
    tags,
    selectedTag,
    updateSelectedTag,
    updateTags,
    deleteTag,
  };

  return (
    <FilterByGroupContext.Provider value={providerValue}>
      {children}
    </FilterByGroupContext.Provider>
  );
};

const withFilterByGroupProvider = <P extends object>(Component: CT<P>) => (props: P) => (
  <FilterByGroupProvider>
    <Component {...props} />
  </FilterByGroupProvider>
);

export default FilterByGroupProvider;
export {
  FilterByGroupContext,
  useFilterByGroupContext,
  withFilterByGroupProvider,
};
