import { flow } from 'lodash';
import {
  asStylableList,
} from '@bodiless/organisms';
import {
  addClasses, withDesign, replaceWith, A,
} from '@bodiless/fclasses';
import {
  asEditable, asSubList, withDeleteNodeOnUnwrap, asBodilessList, asToggledSubList,
} from '@bodiless/components';
import { WithNodeKeyProps } from '@bodiless/core';
import { ComponentType } from 'react';
import { asLink, asEditableLink } from '../../../components/Elements.token';
// First we build a basic list with the correct data structure.

const withLinkTitle = withDesign({
  Title: flow(
    replaceWith(A),
    asLink,
    asEditableLink('link'),
    asEditable('text', 'List Item'),
  ),
});

// Defines the basic sublist for all mubmenu types.
const asDemoSubList = flow(
  asSubList,
  withDeleteNodeOnUnwrap,
  asStylableList,
);

/**
 * Applies a list design (or other HOC) recursively to all submenus.
 *
 * @param design The design object or HOC to be applied.
*/
const withSubListDesign = (design: any) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return withDesign({
    Item: withDesign({
      On: flow(
        withDesign$,
        withDesign({
          Item: withDesign$,
        }),
      ),
    }),
  });
};

/**
 * Applies a list design (or other HOC) to the main menu and all submenus.
 *
 * @param design The design object or HOC to be applied.
*/
const withListDesign = (design: any) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return flow(
    withSubListDesign(withDesign$),
    withDesign$,
  );
};

/**
 * Bodiless HOC generator which creates the basic structure of the Mega Menu. The component
 * to which the HOC applies is irrelevant (it will be replaced by the Menu wrapper).
 *
 * The base mega menu serves as a base for various views on the Menu data, including
 * a site's main menu, a burger menu and breadcrumbs.
 *
 * @param nodeKeys The optional nodekeys specifying where the data should be stored.
 *
 * @return HOC which creates a basic mega menu list.
 */
const asListDemo = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys),
  asStylableList,
  withDesign({
    Item: asToggledSubList,
  }),
  withSubListDesign(asDemoSubList),
  withSubListDesign({
    Item: addClasses('pl-5'),
  }),
);

const ListDemo = flow(
  asListDemo(),
  withListDesign(withLinkTitle),
)('ul') as ComponentType<any>;

export default ListDemo;
