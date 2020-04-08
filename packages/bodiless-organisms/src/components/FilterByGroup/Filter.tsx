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
import { flow, isEmpty } from 'lodash';
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

import Tag from './FilterByGroupTag';

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
    <FilterCategory {...props}><Editable nodeKey="categoryListText" placeholder="Category Name" /></FilterCategory>
  );

  const TagListTitleBase = (props: HTMLProps<HTMLInputElement> & ListTitleProps) => {
    const context = useFilterByGroupContext();
    const { allTags, selectedTag } = useFilterByGroupContext();
    const { setTag, getTag, getSubnode } = useItemsAccessors();
    const titleTextNode = getSubnode('tag-title');

    let tag = getTag();

    if (isEmpty(tag.id)) {
      tag = new Tag(titleTextNode.data.text || '');
      setTag(tag);
      context.addTag(tag);
    } else if ((isEmpty(tag.name) && titleTextNode.data.text) || (titleTextNode.data.text && tag.name !== titleTextNode.data.text)) {
      tag.name = titleTextNode.data.text || '';
      setTag(tag);
      context.addTag(tag);
    } else if (!allTags.some(_tag => _tag.id === tag.id)) {
      context.addTag(tag);
    }

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
        <Label htmlFor={tag.id}>
          <Editable nodeKey="tag-title" placeholder="Tag Name" />
        </Label>
      </FilterInputWrapper>
    );
  };

  const CategoryList = flow(
    asEditableList,
    withListTitle(CategoryListTitle),
  )(List);

  const TagList = flow(
    asEditableList,
    withDesign({
      Title: replaceWith(TagListTitleBase),
      Wrapper: replaceWith(FilterGroupWrapper),
      ItemMenuOptionsProvider: withNewTagButton(),
    }),
  )(List);

  const FilterList = withBasicSublist(TagList)(CategoryList);

  // const { allTags } = useFilterByGroupContext();

  return (
    <FilterList nodeKey="filter" />
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
