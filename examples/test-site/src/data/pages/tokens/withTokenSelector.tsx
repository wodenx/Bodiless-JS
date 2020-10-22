import React from 'react';
import {
  useMenuOptionUI, WithNodeKeyProps, withNodeKey, withNode, ifEditable,
  withLocalContextMenu, withContextActivator, withEditButton, withNodeDataHandlers,
  EditButtonProps,
  withActivatorWrapper,
} from '@bodiless/core';
import { ComponentOrTag, TokensProps } from '@bodiless/fclasses/lib/withTokensFromProps';
import { flowRight, pick } from 'lodash';
import { v4 } from 'uuid';
import type { Token } from './TokenMap';
import TokenMap from './TokenMap';
import { withRandomKey } from '@bodiless/fclasses/src/withTokensFromProps';

type Tokens = {
  [key: string]: Token,
};

type TokenSelectorProps<P> = {
  availableTokens: Tokens,
};

type TokenSelectorData = {
  tokens: string[],
};

const useEditButtonOptions = <P extends object>(props: P & TokenSelectorProps<P>) => {
  const { availableTokens } = props;
  const map = new TokenMap<P>();
  map.add(availableTokens);
  const renderForm = () => {
    const { ComponentFormLabel, ComponentFormSelect, ComponentFormOption } = useMenuOptionUI();
    const options = map.names.map(name => (
      <ComponentFormOption key={name} value={name}>{name}</ComponentFormOption>
    ));
    return (
      <ComponentFormLabel>
        Tokens:
        <ComponentFormSelect field="tokens" multiple>
          {options}
        </ComponentFormSelect>
      </ComponentFormLabel>
    );
  };
  return {
    icon: 'construction',
    name: `token-selector-${v4()}`,
    label: 'Tokens',
    activateContext: false,
    global: false,
    local: true,
    renderForm,
  };
};

const withTokensFromData = <P extends TokensProps<P>>(Component: ComponentOrTag<P>) => {
  const WithTokensFromData = (
    props: P & EditButtonProps<TokenSelectorData> & TokenSelectorProps<P>,
  ) => {
    const { componentData, availableTokens, ...rest } = props;
    const { tokens: names } = componentData;
    const tokens = Object.values(pick(availableTokens, names));
    return <Component {...rest as P} tokens={tokens} />;
  };
  return WithTokensFromData;
};

const withKeyFromData = (C: any) => (p: any) => {
  // Forces re-mount of the component when data changes.
  // Necessary to apply the tokens selected by the editor, since
  // they are only applied at mount.
  const { componentData } = p;
  const key = JSON.stringify(componentData);
  console.log(key);
  return <C {...p} key={key} />;
};

const withTokenSelector = (
  nodeKey?: WithNodeKeyProps,
  defaultData?: TokenSelectorData,
) => flowRight(
  withNodeKey(nodeKey),
  withNode,
  withNodeDataHandlers(defaultData),
  ifEditable(
    withEditButton(useEditButtonOptions),
    withContextActivator('onClick'),
    withActivatorWrapper('onClick', 'div'),
    withLocalContextMenu,
  ),
  withKeyFromData,
  withTokensFromData,
);

export default withTokenSelector;
