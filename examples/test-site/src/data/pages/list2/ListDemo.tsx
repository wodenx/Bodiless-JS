import { flow } from 'lodash';
import {
  asStylableList,
} from '@bodiless/organisms';
import {
  addClasses, withDesign, replaceWith, A,
} from '@bodiless/fclasses';
import {
  asEditable, asSubList, withDeleteNodeOnUnwrap, asBodilessList,
  withSubListDesign, withSubLists, asBodilessChamelion, asChamelionSubList,
} from '@bodiless/components';
import { WithNodeKeyProps } from '@bodiless/core';
import { ComponentType } from 'react';
import { asLink, asEditableLink } from '../../../components/Elements.token';
import { replaceable } from '@bodiless/fclasses/lib/Design';

/**
 * Defines the title for all list items.
 */
export const withLinkTitle = withDesign({
  Title: flow(
    replaceWith(A),
    asLink,
    asEditableLink('link'),
    asEditable('text', 'List Item'),
  ),
});

/**
 * Defines the all sublists
 */
const asDemoSubList = flow(
  replaceable,
  asSubList,
  withDeleteNodeOnUnwrap,
  asStylableList,
);

const withDemoSubListDesign = withSubListDesign(3);
const withDemoSubLists = withDemoSubListDesign(asDemoSubList, asChamelionSubList);

const asListDemo = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDemoSubLists,
  withDemoSubListDesign(withDesign({
    Item: addClasses('pl-5'),
  })),
);

const ListDemo = flow(
  asListDemo(),
  withDemoSubListDesign(withLinkTitle),
  withLinkTitle,
)('ul') as ComponentType<any>;

export default ListDemo;
