import { asMenuLink } from '@bodiless/organisms';
import { startWith, addClasses, withDesign } from '@bodiless/fclasses';
import { Fragment } from 'react';
import { flow } from 'lodash';
import { withTitle } from '@bodiless/layouts';
import { withOnlyProps } from '@bodiless/core';
import { withEditorSimple } from '../../../components/Editors';
import asBodilessChamelion from './organisms/components/Chamelion';

const startWithMenuLink = flow(
  startWith(withOnlyProps('key', 'children')(Fragment)),
  asMenuLink(withEditorSimple),
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
