import { asBodilessChameleon, useChameleonContext } from '@bodiless/components';
import { withDesign, asToken, Div } from '@bodiless/fclasses';
import {
  asBox, asBlue, asOrange, asTeal, withBlueBorder,
} from './Box';

const useToggleOverrides = () => ({
  groupLabel: 'Fill',
  label: () => (useChameleonContext().isOn ? 'Teal' : 'Blue'),
});

export const useSwapOverrides = () => ({
  gropuLabel: 'Fill',
});

const ChameleonBox = asToken(
  asBox,
  asBodilessChameleon('chameleon', undefined, useToggleOverrides),
  // asBodilessChameleon('chameleon', undefined, useSwapOverrides),
  withBlueBorder,
  withDesign({
    Teal: asToken(asTeal, { title: 'Color Tesl' }),
    Orange: asOrange,
    _default: asBlue,
  }),
)(Div);

export default ChameleonBox;
