import React from 'react';
import { withDesign, addClasses, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import {
  asEditable as withEditorSimple,
  asBodilessList,
  asSubList,
} from '@bodiless/components';
import { asStylableList, asMenuLink } from '@bodiless/organisms';
import asChamelionTitle from './asChamelionTitle';

const Foo = (props: any) => <div id="foo" {...props} />;
export const MenuLinkChamelion = flow(
  asChamelionTitle,
  stylable,
  withDesign({
    Link: addClasses('italic'),
  }),
)(Foo);

const withTitleEditor = withEditorSimple('text', 'Menu Item');

const asMenuLinkList = flow(
  withDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asStylableList,
);
const asIndentedSubList = flow(
  asSubList,
  asMenuLinkList,
  withDesign({
    Item: addClasses('pl-5'),
  }),
);
export const CompoundList = flow(
  asBodilessList('clist'),
  asMenuLinkList,
  withDesign({
    Item: asIndentedSubList,
  }),
)('ul');
