/* eslint-disable jsx-a11y/click-events-have-key-events */
// @ts-nocheck
import React, { ComponentType } from 'react';
import { observer } from 'mobx-react-lite';
import { withoutProps, TagType } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import { difference, flowRight } from 'lodash';
import useTagsAccessors from './TagButton/TagModel';

type ToggleHook = (props: any) => boolean;

const withFlowToggle = (useToggle: ToggleHook) => <
  P extends object,
  Q extends object
>(
    On: ComponentType<P>,
    Off: ComponentType<Q>,
  ) => observer((props: P & Q) => (useToggle(props) ? <On {...props} /> : <Off {...props} />));

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

type ToggleByTagsProps = {
  selectedTags: TagType[];
};

const useToggleByTags = <P extends object>({
  selectedTags,
}: P & ToggleByTagsProps) => {
  const { getTags } = useTagsAccessors();
  const itemTags = getTags();
  const tags = itemTags.map(t => t.name);
  return difference(selectedTags, tags).length === 0;
};

const ifTagsSelected = ifToggledOn(useToggleByTags);
const ifTagsNotSelected = ifToggledOff(useToggleByTags);

const withFilterByTags = flowRight(
  ifTagsNotSelected(replaceWith(() => null)),
  withoutProps(['selectedTags']),
);

export { ifTagsSelected, withFilterByTags, ifTagsNotSelected };
