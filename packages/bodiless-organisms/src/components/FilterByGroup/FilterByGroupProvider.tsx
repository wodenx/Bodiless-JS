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

type Tag = {
  id: string,
  name: string,
  category?: string,
};

type FilterByGroupContext = {
  tags: Tag[],
  selectedTag?: string,
  updateSelectedTag: React.Dispatch<React.SetStateAction<string>>,
};

const FilterByGroupContext = React.createContext<FilterByGroupContext>({ tags: [], updateSelectedTag: () => '' });

export const FilterByGroupProvider: FC = ({ children }) => {
  const defaultTags = [
    { id: 'group-item-1', name: 'group-item-1' },
    { id: 'group-item-2', name: 'group-item-2' },
    { id: 'group-item-3', name: 'group-item-3', category: 'Test Category' },
  ];

  const [tags] = useState([...defaultTags]);
  const [selectedTag, updateSelectedTag] = useState('');

  const providerValue: FilterByGroupContext = {
    tags,
    selectedTag,
    updateSelectedTag,
  };

  return (
    <FilterByGroupContext.Provider value={providerValue}>
      {children}
    </FilterByGroupContext.Provider>
  );
};

export const withFilterByGroupProvider = <P extends object>(Component: CT<P>) => (props: P) => (
  <FilterByGroupProvider>
    <Component {...props} />
  </FilterByGroupProvider>
);

export const useFilterByGroupContext = () => useContext(FilterByGroupContext);
