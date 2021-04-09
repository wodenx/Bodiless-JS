import {
  withDesign, asToken, varyDesigns, Div, addProps, HOC, startWith, addClasses,
} from '@bodiless/fclasses';
import { withAllTitlesFromTerms, ifComponentSelector } from '@bodiless/layouts';
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

// We define a custom preview.  These tokens will only be applied
// when the component is rendered in the component selector.
const withCustomPreview = ifComponentSelector(
  addProps({ children: 'this is preview' }),
  addClasses('text-center italic'),
);

const variations = varyDesigns<any>(
  base,
  borders,
  colors,
  // Custom preview token uses an empty string key since the design has only
  // a single key and will be combined with all variants.
  { '': withCustomPreview },
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
