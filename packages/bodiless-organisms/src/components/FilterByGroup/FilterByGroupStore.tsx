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

import { action, observable } from 'mobx';
import { unionBy } from 'lodash';
import { TagType } from './types';

interface FBGStoreInterface {
  tags: TagType[],
  selectedTag: TagType | undefined,
  selectedNodeId: string | undefined,
  setSelectedTag(tag: TagType, nodeId?: string): void,
  addTag(tag: TagType): void,
}

class FBGStore implements FBGStoreInterface {
  @observable selectedTag: TagType | undefined = undefined;

  @observable selectedNodeId: string | undefined = undefined;

  @observable tags: TagType[] = [];

  @action setSelectedTag(tag?: TagType, nodeId?: string) {
    this.selectedTag = tag;
    this.selectedNodeId = nodeId;
  }

  @action addTag(tag: TagType) {
    this.tags = unionBy([tag], this.tags, 'id');
  }
}

export default FBGStore;
