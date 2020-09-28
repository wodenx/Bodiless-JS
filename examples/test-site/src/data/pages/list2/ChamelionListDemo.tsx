import { flow } from 'lodash';
import {
  asStylableList,
} from '@bodiless/organisms';
import {
  addClasses, withDesign, HOC,
} from '@bodiless/fclasses';
import {
  asSubList, withDeleteNodeOnUnwrap, asBodilessList,
  withSubListDesign, withSubLists, asBodilessChamelion,
} from '@bodiless/components';
import { WithNodeKeyProps, PageEditContextInterface, useEditContext } from '@bodiless/core';
import { ComponentType, useCallback } from 'react';
import { withLinkTitle } from './ListDemo';

/**
 * Defines the types of all sublists
 */
const asDemoSubList = flow(
  asSubList,
  withDeleteNodeOnUnwrap,
  asStylableList,
);
const asBulletedSubList = flow(
  asDemoSubList,
  withDesign({
    Item: addClasses('list-disc'),
  }),
);
const asNumberedSubList = flow(
  asDemoSubList,
  withDesign({
    Item: addClasses('list-decimal'),
  }),
);

const DEPTH = 3;
const withDemoSubLists = withSubLists(DEPTH)({
  Bullet: asBulletedSubList,
  Numbered: asNumberedSubList,
});
const withDemoSubListDesign = (withDesign$: HOC) => withSubListDesign(DEPTH)({
  Bullet: withDesign$,
  Numbered: withDesign$,
});

const asListDemo = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDemoSubLists,
  withDemoSubListDesign(withDesign({
    Item: addClasses('ml-5'),
  })),
);

const asBulletedList = withDesign({ Item: addClasses('list-disc') });
const asNumberedList = withDesign({ Item: addClasses('list-decimal') });

const hasChildSubList = (context: PageEditContextInterface): boolean => {
  const descendants = context.activeDescendants || [];
  // The first child list is the one to which this toggle applies,
  // so we check to see if more than one.
  // return descendants.filter(c => c.type === 'sublist-toggle').length > 1;
  return descendants.filter(c => c.type === 'list-item').length > 1;
};
const useChamelionOverrides = () => {
  const context = useEditContext();
  return {
    isHidden: useCallback(() => hasChildSubList(context), []),
    groupLabel: 'List',
  };
};

const ListDemo = flow(
  asListDemo(),
  withDemoSubListDesign(withLinkTitle),
  withLinkTitle,
  asBodilessChamelion('cham-list', { component: 'Bulleted' }, useChamelionOverrides),
  withDesign({
    Bulleted: asBulletedList,
    Numbered: asNumberedList,
  }),
)('ul') as ComponentType<any>;

export default ListDemo;
