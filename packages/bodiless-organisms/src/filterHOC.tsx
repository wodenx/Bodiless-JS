import React, { ComponentType, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useNode } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import { difference, flowRight } from 'lodash';

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
