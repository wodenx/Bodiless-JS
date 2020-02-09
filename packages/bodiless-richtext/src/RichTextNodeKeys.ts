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

import { Node, Value } from 'slate';

const getRichTextNodeKeys = (value: Value) => {
  const keys = new Set();
  function findNodeKey(node: Node) {
    const node$ = node.toJS();
    if (node$.data && node$.data.nodeKey) {
      keys.add(node$.data.nodeKey);
    }
    if (node.object === 'document'
        || node.object === 'block'
        || node.object === 'inline'
    ) {
      node.nodes.flatten().map(n => findNodeKey(n));
    }
  }
  findNodeKey(value.document);
  return keys;
};

const findDeletedNodeKeys = (value1: Value, value2: Value) => {
  const keys1 = getRichTextNodeKeys(value1);
  const keys2 = getRichTextNodeKeys(value2);
  return Array.from(keys1).filter(key => !keys2.has(key));
};

export {
  getRichTextNodeKeys,
  findDeletedNodeKeys,
};
