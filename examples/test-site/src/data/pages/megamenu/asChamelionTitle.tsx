import { asMenuLink } from '@bodiless/organisms';
import { addClasses, withDesign, stylable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import { withTitle } from '@bodiless/layouts';
import { asBodilessChamelion } from '@bodiless/components';
import { withEditorSimple } from '../../../components/Editors';

const startWithMenuLink = flow(
  // startWith(withOnlyProps('key', 'children')(Fragment)),
  asMenuLink(withEditorSimple('text', 'Menu Link')),
  stylable,
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
