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
}

class FBGStore implements FBGStoreInterface {
  @observable selectedTag: TagType | undefined = undefined;

  @observable selectedNodeId: string | undefined = undefined;

  @observable tags: TagType[] = [];

  tagGetters: (() => TagType[])[] = [];

  @action setSelectedTag(tag?: TagType, nodeId?: string) {
    this.selectedTag = tag;
    this.selectedNodeId = nodeId;
  }

  getTags(): TagType[] {
    return this.tagGetters.reduce((acc, getter) => acc.concat(getter()), [] as TagType[]);
  }
}

export default FBGStore;
