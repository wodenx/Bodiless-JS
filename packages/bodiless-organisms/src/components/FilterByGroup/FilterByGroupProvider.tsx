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
  useContext,
  useState,
} from 'react';
import { reject } from 'lodash';
import { TagType } from './types';

type FilterByGroupContext = {
  tags: TagType[],
  selectedTag?: string,
  updateSelectedTag: React.Dispatch<React.SetStateAction<string>>,
  updateTags: React.Dispatch<React.SetStateAction<TagType[]>>,
  deleteTag: (id?: string) => void,
  getTagById: (id: string) => TagType | undefined,
};

const defaultContext: FilterByGroupContext = {
  tags: [],
  updateSelectedTag: () => '',
  updateTags: () => [],
  deleteTag: () => null,
  getTagById: () => undefined,
};

const FilterByGroupContext = React.createContext<FilterByGroupContext>(defaultContext);
const useFilterByGroupContext = () => useContext(FilterByGroupContext);

type FBGContextOptions = {
  name: string,
  tags?: TagType[]
};

const FilterByGroupProvider: FC<FBGContextOptions> = ({ children }) => {
  const defaultTags: TagType[] = [];

  const [tags, updateTags] = useState([...defaultTags]);
  const [selectedTag, updateSelectedTag] = useState('');

  const deleteTag = (id?: string) => updateTags(reject(tags, tag => tag.id === id));
  const getTagById = (id: string) => tags.find(tag => tag.id === id);

  const providerValue: FilterByGroupContext = {
    tags,
    selectedTag,
    updateSelectedTag,
    updateTags,
    deleteTag,
    getTagById,
  };

  return (
    <FilterByGroupContext.Provider value={providerValue}>
      {children}
    </FilterByGroupContext.Provider>
  );
};

export default FilterByGroupProvider;
export {
  FilterByGroupContext,
  useFilterByGroupContext,
};
