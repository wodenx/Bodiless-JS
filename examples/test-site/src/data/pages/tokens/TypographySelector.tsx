import { WithNodeKeyProps, UseBodilessOverrides } from '@bodiless/core';
import { addProps, withTokensFromProps, addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import React, { ComponentType } from 'react';
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
import withTokenSelector, { TokenSelectorProps } from './withTokenSelector';
import { withTokenPanelPane } from './TokenPanelWrapper';
import { useTokenLibrary } from './TokenLibrary';

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
  // asTextWhite: asToken('Clor')(addClasses('text-white')),
};

const withDataTokens = (target: string) => <P extends object>(
  Component: ComponentType<P & TokenSelectorProps>,
) => {
  const WithDataTokens = (props: P & TokenSelectorProps) => {
    const dataTokens = useTokenLibrary(target);
    const { availableTokens: propTokens, ...rest } = props;
    return (
      <Component
        {...rest as P}
        availableTokens={{ ...propTokens, ...dataTokens }}
      />
    );
  };
  return WithDataTokens;
};

const withTypographySelector = (
  nodeKey: WithNodeKeyProps,
  defaultData?: any,
  useOverrides?: UseBodilessOverrides<any, any>,
) => flow(
  withTokensFromProps,
  withTokenSelector(nodeKey, defaultData, useOverrides),
  withDataTokens('typography'),
  addProps({ availableTokens }),
);

export const withTypographyTokenPanel = (
  nodeKey: WithNodeKeyProps,
  defaultData?: any,
) => flow(
  withTokensFromProps,
  withTokenPanelPane(nodeKey, defaultData),
  withDataTokens('typography'),
  addProps({ availableTokens }),
);

export default withTypographySelector;
