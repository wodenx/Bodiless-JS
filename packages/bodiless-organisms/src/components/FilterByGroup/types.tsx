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

import { ComponentType, HTMLProps } from 'react';
import { StylableProps, DesignableComponentsProps } from '@bodiless/fclasses';

export type FilterByGroupComponents = {
  Wrapper: ComponentType<StylableProps>,
  FilterWrapper: ComponentType<StylableProps>,
  ContentWrapper: ComponentType<StylableProps>,
  ResetButton: ComponentType<StylableProps & HTMLProps<HTMLButtonElement>>,
  Filter: ComponentType<StylableProps>,
};

export type FilterComponents = {
  FilterCategory: ComponentType<StylableProps>,
  FilterGroupItem: ComponentType<StylableProps & HTMLProps<HTMLInputElement>>,
  FilterGroupWrapper: ComponentType<StylableProps>,
  FilterInputWrapper: ComponentType<StylableProps>,
};

export type FilterByGroupProps = DesignableComponentsProps<FilterByGroupComponents>;
export type FilterProps = DesignableComponentsProps<FilterComponents>;

export type TagType = {
  id: string,
  name: string,
};

export type EditableNodeData = {
  text: string,
};

export type FBGContextOptions = {
  suggestions?: TagType[],
};

export interface FBGContextInterface {
  readonly defaultSuggestions: TagType[]
  readonly selectedTag: TagType | undefined,
  readonly selectedNode: string | undefined,
  readonly allTags: TagType[],
  setSelectedTag: (tag?: TagType, nodeId?: string) => void,
  addTag: (tag: TagType) => void,
  spawn: (instance: FBGContextOptions) => FBGContextInterface,
  refresh: () => void,
}
