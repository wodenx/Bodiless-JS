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

import { unionBy } from 'lodash';
import { useNode } from '@bodiless/core';
import { TagType, EditableNodeData } from './types';

const useItemsAccessors = () => {
  const { node } = useNode<TagType>();

  return {
    getTag: () => node.data || { id: '', name: '' },
    setTag: (tag: TagType) => node.setData(tag),
    getSubnode: (nodeKey: string) => node.child<EditableNodeData>(nodeKey),
    deleteSubnode: (item?: string) => {
      const path$ = item ? node.path.concat(item) : node.path;
      return node.delete(path$);
    },
  };
};

type CategoryNode = {
  tags: TagType[],
  items: string[],
};

const useCategoryAccessors = () => {
  const { node } = useNode<CategoryNode>();
  // const categoryNode = node.child<CategoryNode>(nodeKey);

  return {
    getNode: () => node,
    getSubnode: (nodeKey: string) => node.child<CategoryNode>(nodeKey),
    setTags: (tags: TagType[]) => {
      // console.log('input tags: ', tags);
      // console.log('data Before: ', { ...node.data });
      node.setData({ ...node.data, tags });
      // console.log('data After: ', node.data);
    },
    getTags: () => node.data.tags || [],
  };
};

const useAddItem = () => {
  const { getTags, setTags } = useCategoryAccessors();
  return (tag: TagType) => {
    const tags = getTags();
    const newTags = unionBy([{ ...tag }], tags, 'id');

    setTags(newTags);
  };
};

const useItemsMutators = () => ({
  addItem: useAddItem(),
});

export {
  useCategoryAccessors,
  useItemsAccessors,
  useItemsMutators,
};
