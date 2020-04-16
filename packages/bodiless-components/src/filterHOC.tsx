import React, { ComponentType, Fragment, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNode, withNode } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import { difference, flowRight, flow } from 'lodash';

type ToggleHook = (props: any) => boolean;

const withFlowToggle = (useToggle: ToggleHook) => <P extends object, Q extends object>(
  On: ComponentType<P>,
  Off: ComponentType<Q>,
) => observer(
    (props: P & Q) => (
      useToggle(props) ? <On {...props} /> : <Off {...props} />
    ),
  );

const ifToggledOn = (useToggle: ToggleHook) => <H extends Function>(...hocs: Function[]) => (
  Component: ComponentType<any>,
  //  @ts-ignore Ex  ct ed at least 1  rg uments, but got 0 or more.ts(2557)
) => withFlowToggle(useToggle)(flowRight(...hocs)(Component), Component);

const ifToggledOff = (useToggle: ToggleHook) => <H extends Function>(...hocs: Function[]) => (
  Component: ComponentType<any>,
  // @ts-ignore Ex  ct ed at least   a rguments, but got 0 or more.ts(2557)
) => withFlowToggle(useToggle)(Component, flowRight(...hocs)(Component));

type TagsData = {
  tags: string[],
};

const useTagsAccessors = () => {
  const { node } = useNode<TagsData>();
  return {
    getTags: () => node.data.tags,
  };
};

type ToggleByTagsProps = {
  selectedTags: string[],
};

const useToggleByTags = <P extends object>({ selectedTags }: P & ToggleByTagsProps) => {
  const itemTags = useTagsAccessors().getTags();
  return difference(selectedTags, itemTags).length === 0;
};

const ifTagsSelected = ifToggledOn(useToggleByTags);
const ifTagsNotSelected = ifToggledOff(useToggleByTags);

const withFilterByTags = ifTagsSelected(
  replaceWith(Fragment),
);

export { ifTagsSelected, withFilterByTags, ifTagsNotSelected };


// For each of these we'll have to create a mock node (or json file)
// which provides the correct item tag
const FilterableItem = flow(
  withFilterByTags,
  withNode,
)('div');

export const TestFilterSelector = () => {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div>
      <div>
        <h2>Select a tag to filter by</h2>
        <a onClick={() => setTags(['foo'])}>foo</a>
        <a onClick={() => setTags(['bar'])}>bar</a>
        <a onClick={() => setTags(['baz'])}>baz</a>
        <a onClick={() => setTags(['bat'])}>bat</a>
      </div>
      <div>
        <h2>Filtered Components</h2>
        <FilterableItem nodeKey="foo" selectedTags={tags}>foo</FilterableItem>
        <FilterableItem nodeKey="bar" selectedTags={tags}>bar</FilterableItem>
        <FilterableItem nodeKey="baz" selectedTags={tags}>baz</FilterableItem>
        <FilterableItem nodeKey="bat" selectedTags={tags}>bat</FilterableItem>
      </div>
    </div>
  )

}


