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

import React, { FC, HTMLProps, ComponentType as CT } from 'react';
import { flow, flowRight } from 'lodash';
import {
  // withNode,
  // withNodeDataHandlers,
  // ifReadOnly,
  // withNodeKey,
  // withoutProps,
  // withData,
  useNode,
  // useNodeDataHandlers,
} from '@bodiless/core';
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
  // ListProps,
  ListTitleProps,
} from '@bodiless/components';
import { FilterComponents, FilterProps } from './types';
import { useFilterByGroupContext } from './FilterByGroupProvider';

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

type TagType = {
  id: string,
  name: string,
};

type NodeData = {
  text: string,
};

const withMeta = (
  nodeKey: string,
  nodeCollection?: string | undefined,
) => (Component: CT) => (props: any) => {
  const { node } = useNode(nodeCollection);
  const childNode = node.child<NodeData>(nodeKey);

  node.setData(new Tag(childNode.data.text));

  return <Component {...props} />;
};

const TagListTitleBase = (props: HTMLProps<HTMLInputElement> & ListTitleProps) => {
  const { node } = useNode<TagType>();
  const tag = node.data;

  return (
    <Div {...props}>
      <Input type="radio" name="filter-item" value={tag.name} id={tag.id} />
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
    Wrapper: flow(stylable, addClasses('pl-10')),
    // Item: flow(
    //   Set Node context here and consume it in Title
    // )
  }),
)(List);

const FilterList = withBasicSublist(SimpleTagList)(SimpleCategoryList);

const FilterBase: FC<FilterProps> = ({ components }) => {
  const {
    FilterCategory,
    FilterGroupItem,
    FilterGroupWrapper,
    FilterInputWrapper,
  } = components;

  const { tags, selectedTag, updateSelectedTag } = useFilterByGroupContext();

  return (
    <React.Fragment>
      <FilterList nodeKey="filter" />
      <FilterCategory>Filter Category</FilterCategory>
      <FilterGroupWrapper>
        {tags.map(tag => (
          <FilterInputWrapper key={tag.id}>
            <FilterGroupItem type="radio" name="filter-item" value={tag.id} id={tag.id} onChange={() => updateSelectedTag(tag.id)} checked={selectedTag === tag.id} />
            <Label htmlFor={tag.id}>{ tag.name }</Label>
          </FilterInputWrapper>
        ))}
      </FilterGroupWrapper>
    </React.Fragment>
  );
};

const FilterClean = flow(
  designable(FilterComponentsStart),
)(FilterBase);

export default FilterClean;
