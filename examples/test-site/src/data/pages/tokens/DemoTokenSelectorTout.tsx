import { flow } from 'lodash';
import { withTokensFromProps, addProps, withDesign } from '@bodiless/fclasses';
import { ToutClean } from '@bodiless/organisms';
import { asEditableTout } from '../../../components/Tout';
import withTypographySelector from './TypographySelector';
import withTokenSelector from './withTokenSelector';
import * as availableTokens from '../../../components/Tout/token';

const DemoTokenSelectorTout = flow(
  asEditableTout,
  withDesign({
    Title: withTypographySelector('title-selector', undefined, () => ({ groupLabel: 'Title' })),
    Body: withTypographySelector('body-selector', undefined, () => ({ groupLabel: 'Body' })),
  }),
  withTokensFromProps,
  withTokenSelector('selector', undefined, () => ({ groupLabel: 'Tout', groupMerge: 'none' })),
  addProps({ availableTokens }),
)(ToutClean);

export default DemoTokenSelectorTout;
