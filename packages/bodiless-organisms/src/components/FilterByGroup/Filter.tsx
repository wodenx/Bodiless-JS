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

import React, { FC, HTMLProps } from 'react';
import { flow } from 'lodash';
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
  useListItemAccessors,
} from '@bodiless/components';
import { useNode, useNodeDataHandlers } from '@bodiless/core';
import { FilterComponents, FilterProps } from './types';
import { useFilterByGroupContext } from './FilterByGroupProvider';

const FilterComponentsStart:FilterComponents = {
  FilterCategory: H3,
  FilterGroupWrapper: Div,
  FilterGroupItem: Input,
  FilterInputWrapper: Div,
};

const CategoryListTitle = (props: HTMLProps<HTMLHeadingElement> & ListTitleProps) => (
  <H3 {...props}><Editable nodeKey="categoryListText" placeholder="Category Name" /></H3>
);

// const TagListTitle = ({ checked, onChange, ...rest }: HTMLProps<HTMLInputElement> & ListTitleProps ) => (
//   <React.Fragment {...rest}>
//     <Input type="radio" name="filter-item" value={tag.id} id={tag.id} onChange={onChange} checked={checked} />
//     <Label htmlFor={tag.id}>
//       <Editable nodeKey="tag" placeholder="Tag Name" />
//     </Label>
//   </React.Fragment>
// );

type Tag = {
  id: string,
  name: string,
}

type TagListTitleProps = {
  tag: Tag,
} & HTMLProps<HTMLInputElement> & ListTitleProps;

const TagListTitle = ({ tag, onChange, checked, ...rest}: TagListTitleProps ) => {
  const { getItems } = useListItemAccessors();
  const { node } = useNode();
  const { componentData } = useNodeDataHandlers();

  console.log('Items: ', getItems());
  console.log('node: ', node.data);
  console.log('componentData: ', componentData);

  return (
    <Div {...rest} >
      <Input type="radio" name="filter-item" value="test" id="test" />
      <Label htmlFor="test">
        <Editable nodeKey="tag" placeholder="Tag Name" />
      </Label>
    </Div>
  )
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
    Title: replaceWith(TagListTitle),
    Wrapper: flow(stylable, addClasses('pl-10')),
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
