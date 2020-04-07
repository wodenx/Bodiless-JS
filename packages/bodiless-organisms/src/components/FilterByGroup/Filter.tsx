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
import {
  flow,
  flowRight,
  isEmpty,
} from 'lodash';
import {
  stylable,
  designable,
  Div,
  H3,
  Input,
  Label,
  withDesign,
  replaceWith,
  addClasses,
} from '@bodiless/fclasses';
import {
  List,
  Editable,
  asEditableList,
  withBasicSublist,
  ListTitleProps,
} from '@bodiless/components';
import { FilterComponents, FilterProps } from './types';
import { useFilterByGroupContext } from './FilterByGroupContext';
import { useItemsAccessors } from './FilterTagsModel';

import Tag from './FilterByGroupTag';

const FilterComponentsStart:FilterComponents = {
  FilterCategory: H3,
  FilterGroupWrapper: Div,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const CategoryListTitle = (props: HTMLProps<HTMLHeadingElement> & ListTitleProps) => (
  <H3 {...props}><Editable nodeKey="categoryListText" placeholder="Category Name" /></H3>
);

const withMeta = (
  nodeKey: string,
) => (Component: CT) => (props: any) => {
  const { setTag, getTag, getSubnode } = useItemsAccessors();
  const context = useFilterByGroupContext();
  const tag = getTag();
  const childNode = getSubnode(nodeKey);

  if (isEmpty(tag.id)) {
    const newTag = new Tag(childNode.data.text || '');
    setTag(newTag);
    context.addTag(newTag);
  } else if (isEmpty(tag.name) && childNode.data.text) {
    tag.name = childNode.data.text || '';
    setTag(tag);
    context.addTag(tag);
  } else if (!context.allTags.some(_tag => _tag.id === tag.id)) {
    context.addTag(tag);
  }

  return <Component {...props} />;
};

const withCategoryMeta = (
  nodeKey?: string,
) => (Component: CT) => (props: any) => (<Component {...props} />);

const TagListTitleBase = (props: HTMLProps<HTMLInputElement> & ListTitleProps) => {
  const { getTag } = useItemsAccessors();
  const tag = getTag();

  const context = useFilterByGroupContext();
  const { selectedTag } = useFilterByGroupContext();
  const isTagSelected = Boolean(selectedTag && selectedTag.id === tag.id);

  return (
    <Div {...props}>
      <Input type="radio" name="filter-item" value={tag.id} id={tag.id} onChange={() => context.setSelectedTag(tag)} checked={isTagSelected} />
      <Label htmlFor={tag.id}>
        <Editable nodeKey="tag-title" placeholder="Tag Name" />
      </Label>
    </Div>
  );
};

const TagListTitle = flowRight(
  withMeta('tag-title'),
)(TagListTitleBase);

const SimpleCategoryList = flow(
  asEditableList,
  withDesign({
    Title: replaceWith(CategoryListTitle),
  }),
)(List);

const SimpleTagList = flow(
  asEditableList,

  withDesign({
    Title: replaceWith(TagListTitle),
    Wrapper: flow(stylable, addClasses('pl-10'), withCategoryMeta()),
  }),
)(List);

const FilterList = withBasicSublist(SimpleTagList)(SimpleCategoryList);

const FilterBase: FC<FilterProps> = ({ components }) => {
  // const {
  //   FilterCategory,
  //   FilterGroupItem,
  //   FilterGroupWrapper,
  //   FilterInputWrapper,
  // } = components;

  return (
    <FilterList nodeKey="filter" />
    // <FilterCategory>Filter Category</FilterCategory>
    // <FilterGroupWrapper>
    //   {tags.map(tag => (
    //     <FilterInputWrapper key={tag.id}>
    //       <FilterGroupItem type="radio" name="filter-item" value={tag.id} id={tag.id} onChange={() => updateSelectedTag(tag.id)} checked={selectedTag === tag.id} />
    //       <Label htmlFor={tag.id}>{ tag.name }</Label>
    //     </FilterInputWrapper>
    //   ))}
    // </FilterGroupWrapper>
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
