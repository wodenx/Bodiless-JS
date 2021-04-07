import {
  withDesign, asToken, varyDesigns, Div, addProps, HOC, startWith,
} from '@bodiless/fclasses';
import { withAllTitlesFromTerms } from '@bodiless/layouts';
import pick from 'lodash/pick';
import {
  asBox, asBlue, asOrange, asRounded, asSquare, withBlueBorder, withTealBorder, asTeal,
} from './Box';

// These are metadata categories which should be ignored in
// the flow container filters.
const blacklistCategories = ['Category', 'Attribute', 'Component'];

// This is the base component which will be included in all variations.
const base = {
  Box: asToken(startWith(Div) as HOC, asBox),
};

// Available colors
const bgColors = {
  Orange: asOrange,
  Blue: asBlue,
  Teal: asTeal,
};

// Available border colors.
const borderColors = {
  Blue: withBlueBorder,
  Teal: withTealBorder,
};

// Available  border types
const borders = {
  Rounded: asRounded,
  Square: asSquare,
};

// Only allow certain combinations of color/border
const colors = {
  ...varyDesigns(
    pick(bgColors, 'Orange'),
    borderColors,
  ),
  ...varyDesigns(
    pick(bgColors, 'Blue'),
    pick(borderColors, 'Teal'),
  ),
  ...varyDesigns(
    pick(bgColors, 'Teal'),
    pick(borderColors, 'Blue'),
  ),
};

const variations = varyDesigns<any>(
  base,
  borders,
  colors,
);

// const basicDesign$ = {
//   Default: asToken(replaceWith(Div), asBox),
//   Orange: asToken(replaceWith(Div), asBox, asOrange),
//   Blue: asToken(replaceWith(Div), asBox, asBlue),
//   Teal: asToken(replaceWith(Div), asBox, asTeal),
// };

const asBasicFlowContainer = asToken(
  withAllTitlesFromTerms({ blacklistCategories }),
  withDesign(variations) as HOC,
  addProps({ blacklistCategories }),
  addProps({ mandatoryCategories: ['Color'] }),
);

export default asBasicFlowContainer;
