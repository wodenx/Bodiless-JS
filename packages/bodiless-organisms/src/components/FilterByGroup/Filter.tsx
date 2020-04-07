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
import React, { FC, HTMLProps, ComponentType as CT } from 'react';
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
  ListTitleProps,
} from '@bodiless/components';
import { FilterComponents, FilterProps, withTagType } from './types';
import { useFilterByGroupContext } from './FilterByGroupContext';
import { useItemsAccessors } from './FilterTagsModel';

import Tag from './FilterByGroupTag';

const FilterComponentsStart:FilterComponents = {
  FilterCategory: H3,
  FilterGroupWrapper: Ul,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const withTagMeta = <P extends object>(nodeKey: string) => (
  Component: CT<P> | string,
) => (props: P) => {
  const { setTag, getTag, getSubnode } = useItemsAccessors();
  const context = useFilterByGroupContext();
  const childNode = getSubnode(nodeKey);

  let tag = getTag();

  if (isEmpty(tag.id)) {
    tag = new Tag(childNode.data.text || '');
    setTag(tag);
    context.addTag(tag);
  } else if ((isEmpty(tag.name) && childNode.data.text) || (childNode.data.text && tag.name !== childNode.data.text)) {
    tag.name = childNode.data.text || '';
    setTag(tag);
    context.addTag(tag);
  } else if (!context.allTags.some(_tag => _tag.id === tag.id)) {
    context.addTag(tag);
  }

  return (<Component {...props} tag={tag} />);
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

  const TagListTitleBase = (props: HTMLProps<HTMLInputElement> & ListTitleProps & withTagType) => {
    const { tag, ...rest } = props;
    const context = useFilterByGroupContext();
    const { selectedTag } = useFilterByGroupContext();
    const isTagSelected = Boolean(selectedTag && selectedTag.id === tag.id);

    return (
      <FilterInputWrapper {...rest}>
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

  const SimpleCategoryList = flow(
    asEditableList,
    withDesign({
      Title: replaceWith(CategoryListTitle),
    }),
  )(List);

  const SimpleTagList = flow(
    asEditableList,
    withDesign({
      Title: flow(
        replaceWith(TagListTitleBase),
        withTagMeta('tag-title'),
      ),
      Wrapper: replaceWith(FilterGroupWrapper),
    }),
  )(List);

  const FilterList = withBasicSublist(SimpleTagList)(SimpleCategoryList);

  // const { allTags } = useFilterByGroupContext();

  return (
    <FilterList nodeKey="filter" />
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
