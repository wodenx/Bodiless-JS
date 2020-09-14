import { flow } from 'lodash';
import {
  withDesign, replaceWith, H2, addClasses, stylable,
} from '@bodiless/fclasses';
import {
  asMenuTout, asMegaMenuBase, withMegaMenuDesign, asMegaMenu, asMegaMenuBreadcrumbs,
  asMenuLink,
} from '@bodiless/organisms';
import { Fragment } from 'react';
import { asReadOnly } from '@bodiless/core';
import { asEditable as withEditorSimple } from '@bodiless/components';
// import { withEditorSimple } from '../Editors';
import withMenuStyles, { withMenuToutStyles } from './MegaMenu.token';
import { withToutEditors } from '../Tout';

export const withTitleEditor = withEditorSimple('text', 'Menu Item');

// Customize the tout editors so the node keys match
const withMenuToutEditors = flow(
  withToutEditors,
  withDesign({
    Title: flow(
      replaceWith(H2),
      // We set the title editor to match the one in asMenuLink
      withEditorSimple('text', 'Title'),
    ),
  }),
);

const asMenuTout$ = flow(
  asMenuTout(withMenuToutEditors),
  withMenuToutStyles,
);

const asMegaMenuBase$ = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
);

const MegaMenu = flow(
  asMegaMenuBase$,
  asMegaMenu(
    withMenuStyles,
    withDesign({
      Item: withDesign({
        Touts: withDesign({
          Title: asMenuTout$,
        }),
      }),
    }),
  ),
)(Fragment);

const MegaMenuList = flow(
  asMegaMenuBase$,
  withMegaMenuDesign({
    Item: addClasses('pl-5'),
  }),
  asReadOnly,
)('ul');

// Styles for breadcrumbs.
const asInline = withDesign({
  Wrapper: withDesign({
    WrapperItem: flow(stylable, addClasses('inline pl-5')),
    List: flow(stylable, addClasses('inline')),
  }),
  Item: addClasses('inline pl-5'),
});

const MegaMenuBreadcrumbs = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asMegaMenuBreadcrumbs,
  withMegaMenuDesign(asInline),
  asReadOnly,
)('ul');

export default MegaMenu;
export { MegaMenuBreadcrumbs, MegaMenuList };
