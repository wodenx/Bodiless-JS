import { asMenuLink } from '@bodiless/organisms';
import { startWith, addClasses, withDesign } from '@bodiless/fclasses';
import { Fragment } from 'react';
import { flow } from 'lodash';
import { withTitle } from '@bodiless/layouts';
import { withOnlyProps } from '@bodiless/core';
import { asBodilessChamelion } from '@bodiless/components';
import { withEditorSimple } from '../../../components/Editors';

const startWithMenuLink = flow(
  startWith(withOnlyProps('key', 'children')(Fragment)),
  asMenuLink(withEditorSimple('text', 'Menu Link')),
);

const asRed = flow(
  startWithMenuLink,
  addClasses('text-red-500'),
  withTitle('Red Text'),
);

const asBlue = flow(
  startWithMenuLink,
  addClasses('text-blue-500'),
  withTitle('Blue Text'),
);

const asWhite = flow(
  startWithMenuLink,
  addClasses('text-white'),
  withTitle('White Text'),
);

const design = {
  Red: asRed,
  Blue: asBlue,
  White: asWhite,
};

const asChamelionTitle = flow(
  asBodilessChamelion('cham-component', { component: 'White' }),
  withDesign(design),
);

export default asChamelionTitle;
