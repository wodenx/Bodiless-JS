/* eslint-disable jsx-a11y/click-events-have-key-events */
// @ts-nocheck
import React, {ComponentType, FC, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { useNode, withoutProps, withNode } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import {difference, flow, flowRight} from 'lodash';

type ToggleHook = (props: any) => boolean;

const withFlowToggle = (useToggle: ToggleHook) => <
  P extends object,
  Q extends object
>(
  On: ComponentType<P>,
  Off: ComponentType<Q>,
) =>
  observer((props: P & Q) =>
    useToggle(props) ? <On {...props} /> : <Off {...props} />,
  );

const ifToggledOn = (useToggle: ToggleHook) => <H extends Function>(
  ...hocs: Function[]
) => (
  Component: ComponentType<any>,
  //  @ts-ignore Ex  ct ed at least 1  rg uments, but got 0 or more.ts(2557)
) => withFlowToggle(useToggle)(flowRight(...hocs)(Component), Component);

const ifToggledOff = (useToggle: ToggleHook) => <H extends Function>(
  ...hocs: Function[]
) => (
  Component: ComponentType<any>,
  // @ts-ignore Ex  ct ed at least   a rguments, but got 0 or more.ts(2557)
) => withFlowToggle(useToggle)(Component, flowRight(...hocs)(Component));

type TagsData = {
  tags: string[];
};

const useTagsAccessors = () => {
  const { node } = useNode<TagsData>();
  return {
    getTags: () => node.data.tags,
  };
};

type ToggleByTagsProps = {
  selectedTags: string[];
};

const useToggleByTags = <P extends object>({
  selectedTags,
}: P & ToggleByTagsProps) => {
  const itemTags = useTagsAccessors().getTags();
  return difference(selectedTags, itemTags).length === 0;
};

const ifTagsSelected = ifToggledOn(useToggleByTags);
const ifTagsNotSelected = ifToggledOff(useToggleByTags);

const withFilterByTags = flowRight(
  ifTagsNotSelected(replaceWith(() => null)),
  withoutProps(['selectedTags']),
);

const TestDiv: FC<any> = props => <div {...props} />;

const FilterableItem = flow(
  withFilterByTags,
  withNode,
// @TODO: Fix so that this type cast is not necessary.
)(TestDiv) as React.ComponentType<any>;

const TestFilterSelector = () => {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div>
      <div>
        <h2>Select a tag to filter by</h2>
        <button id="show-foo" type="button" onClick={() => setTags(['foo'])}>
          foo
        </button>
        <button id="show-bar" type="button" onClick={() => setTags(['bar'])}>
          bar
        </button>
        <button id="show-baz" type="button" onClick={() => setTags(['baz'])}>
          baz
        </button>
        <button id="show-bat" type="button" onClick={() => setTags(['bat'])}>
          bat
        </button>
      </div>
      <div>
        <h2>Filtered Components</h2>
        <FilterableItem nodeKey="foo" selectedTags={tags} id="foo">
          foo
        </FilterableItem>
        <FilterableItem nodeKey="bar" selectedTags={tags} id="bar">
          bar
        </FilterableItem>
        <FilterableItem nodeKey="baz" selectedTags={tags} id="baz">
          baz
        </FilterableItem>
        <FilterableItem nodeKey="bat" selectedTags={tags} id="bat">
          bat
        </FilterableItem>
      </div>
    </div>
  );
};
export { ifTagsSelected, withFilterByTags, ifTagsNotSelected, TestFilterSelector };
