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

/* eslint-disable arrow-body-style, max-len, @typescript-eslint/no-unused-vars */
import React, { FC, HTMLProps } from 'react';
import { flow } from 'lodash';
import {
  withNodeKey,
  withNode,
  withNodeDataHandlers,
  withData,
  ifReadOnly,
  withoutProps,
  ifEditable,
  withContextActivator,
  withLocalContextMenu,
} from '@bodiless/core';
import {
  designable,
  Div,
  H3,
  Ul,
  Input,
  Label,
  withDesign,
  replaceWith,
} from '@bodiless/fclasses';
import {
  List,
  Editable,
  asEditableList,
  withBasicSublist,
  withListTitle,
  ListTitleProps,
} from '@bodiless/components';
import { withNewTagButton } from './withNewTagButton';
import { FilterComponents, FilterProps } from './types';
import { useFilterByGroupContext } from './FilterByGroupContext';
import { useItemsAccessors } from './FilterTagsModel';

const FilterComponentsStart:FilterComponents = {
  FilterCategory: H3,
  FilterGroupWrapper: Ul,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const FilterBase: FC<FilterProps> = ({ components }) => {
  const {
    FilterCategory,
    FilterGroupItem,
    FilterGroupWrapper,
    FilterInputWrapper,
  } = components;

  const CategoryListTitle = (props: HTMLProps<HTMLHeadingElement> & ListTitleProps) => (
    <FilterCategory {...props}>
      <Editable nodeKey="categoryListText" placeholder="Category Name" />
    </FilterCategory>
  );

  const TagListTitleBase = (props: HTMLProps<HTMLInputElement> & ListTitleProps) => {
    const context = useFilterByGroupContext();
    const { tag } = useItemsAccessors();
    const { selectedTag } = context;

    const isTagSelected = Boolean(selectedTag && selectedTag.id === tag.id);

    return (
      <FilterInputWrapper {...props}>
        <FilterGroupItem
          type="radio"
          name="filter-item"
          value={tag.id}
          id={tag.id}
          onChange={() => context.setSelectedTag(tag)}
          checked={isTagSelected}
        />
        <Label htmlFor={tag.id}>{ tag.name || 'Select tag...' }</Label>
      </FilterInputWrapper>
    );
  };

  const CategoryList = flow(
    asEditableList,
    withListTitle(CategoryListTitle),
  )(List);

  const TagTitle = flow(
    withoutProps(['componentData']),
    ifEditable(
      withNewTagButton,
      withContextActivator('onClick'),
      withLocalContextMenu,
    ),
    ifReadOnly(withoutProps(['setComponentData'])),
    withNodeDataHandlers({ id: '', name: '' }),
    withNode,
    withNodeKey('tag'),
    withData,
  )(TagListTitleBase);

  const TagList = flow(
    asEditableList,
    withDesign({
      Title: replaceWith(TagTitle),
      Wrapper: replaceWith(FilterGroupWrapper),
    }),
  )(List);

  const FilterList = withBasicSublist(TagList)(CategoryList);

  return (
    <FilterList nodeKey="filter" />
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
