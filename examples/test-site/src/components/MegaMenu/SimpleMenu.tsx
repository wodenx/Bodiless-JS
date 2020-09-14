import { Fragment, ComponentType } from 'react';
import { addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import {
  asMenuLink, asSimpleMenuBase, withSimpleMenuDesign,
  asSimpleMenu,
} from '@bodiless/organisms';
import { withSimpleMenuStyles } from './MegaMenu.token';
import { withTitleEditor } from './MegaMenu';

export const SimpleMenu = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asSimpleMenu(
    withSimpleMenuStyles,
  ),
)(Fragment);

export const SimpleMenuList = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withSimpleMenuDesign({
    Item: addClasses('pl-5'),
  }),
)('ul') as ComponentType<any>;
