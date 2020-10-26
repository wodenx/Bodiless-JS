import { WithNodeKeyProps, UseBodilessOverrides } from '@bodiless/core';
import { addProps, withTokensFromProps } from '@bodiless/fclasses';
import { flow } from 'lodash';
import {
  asBold,
  asItalic,
  asUnderline,
  asLink,
  asStrikeThrough,
  asHeader1,
  asHeader2,
  asHeader3,
  asCta,
  asPrimaryColorBackground,
  asSuperScript,
  asTextColorPrimary,
} from '../../../components/Elements.token';
import { asToken } from './TokenMap';
import withTokenSelector from './withTokenSelector';

const availableTokens = {
  asBold: asToken('Style')(asBold),
  asItalic: asToken('Style')(asItalic),
  asUnderline: asToken('Style')(asUnderline),
  asLink: asToken('Style')(asLink),
  asStrikeThrough: asToken('Style')(asStrikeThrough),
  asHeader1: asToken('Headers')(asHeader1),
  asHeader2: asToken('Headers')(asHeader2),
  asHeader3: asToken('Headers')(asHeader3),
  asCta: asToken('Style')(asCta),
  asPrimaryColorBackground: asToken('Color')(asPrimaryColorBackground),
  asSuperScript: asToken('Style')(asSuperScript),
  asTextColorPrimary: asToken('Color')(asTextColorPrimary),
};

const withTypographySelector = (
  nodeKey: WithNodeKeyProps,
  defaultData?: any,
  useOverrides?: UseBodilessOverrides<any, any>,
) => flow(
  withTokensFromProps,
  withTokenSelector(nodeKey, defaultData, useOverrides),
  addProps({ availableTokens }),
);

export default withTypographySelector;
