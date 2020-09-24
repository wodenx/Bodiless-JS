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
import { WithNodeKeyProps } from '@bodiless/core';
import { ComponentType } from 'react';
import { withLinkTitle } from './ListDemo';

/**
 * Defines the all sublists
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

const mainListOverrides = () => ({
  groupLabel: 'List Type',
});

const ListDemo = flow(
  asListDemo(),
  withDemoSubListDesign(withLinkTitle),
  withLinkTitle,
  asBodilessChamelion('cham-list', { component: 'Bulleted' }, mainListOverrides),
  withDesign({
    Bulleted: asBulletedList,
    Numbered: asNumberedList,
  }),
)('ul') as ComponentType<any>;

export default ListDemo;
