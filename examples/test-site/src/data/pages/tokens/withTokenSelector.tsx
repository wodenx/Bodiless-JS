import React from 'react';
import {
  useMenuOptionUI, WithNodeKeyProps, withNodeKey, withNode, ifEditable,
  withLocalContextMenu, withContextActivator, withEditButton, withNodeDataHandlers,
  EditButtonProps,
  EditButtonOptions,
  UseBodilessOverrides,
} from '@bodiless/core';
import { ComponentOrTag, TokensProps } from '@bodiless/fclasses/lib/withTokensFromProps';
import { flowRight, pick } from 'lodash';
import { v4 } from 'uuid';
import type { Token } from './TokenMap';
import TokenMap from './TokenMap';

export type Tokens = {
  [key: string]: Token,
};

export type TokenSelectorProps = {
  availableTokens: Tokens,
};

export type TokenSelectorData = {
  tokens: string[],
};

const initialValueHandler = (
  data: TokenSelectorData,
) => (data.tokens || []).reduce((acc, next) => ({
  ...acc,
  [next]: true,
}), {});

const submitValueHandler = (data: { [field: string]: boolean }) => ({
  tokens: Object.keys(data).reduce((acc, next) => (
    data[next] ? [...acc, next] : [...acc]
  ), [] as string[]),
});

// const useCheckboxes = (map: TokenMap<any>) => map.names.map(name => {
//   const { ComponentFormLabel, ComponentFormCheckBox } = useMenuOptionUI();
//   return (
//     <ComponentFormLabel>
//       <ComponentFormCheckBox field={name} />
//       {name}
//     </ComponentFormLabel>
//   );
// });

const useCategoryCheckboxes = (map: TokenMap<any>) => {
  const { ComponentFormLabel, ComponentFormCheckBox } = useMenuOptionUI();
  return map.categories.map(cat => (
    <>
      <ComponentFormLabel>{cat}</ComponentFormLabel>
      {map.namesFor(cat).map(name => (
        <ComponentFormLabel>
          <ComponentFormCheckBox field={name} />
          {name}
        </ComponentFormLabel>
      ))}
    </>
  ));
};

const useEditButtonOptions = (
  useOverrides: UseBodilessOverrides<any, any> = () => ({}),
) => <P extends object>(props: P & TokenSelectorProps): EditButtonOptions<any, any> => {
  const { availableTokens } = props;
  const map = new TokenMap<P>();
  map.add(availableTokens);
  const renderForm = () => {
    const { ComponentFormTitle } = useMenuOptionUI();
    return (
      <>
        <ComponentFormTitle>Tokens</ComponentFormTitle>
        {useCategoryCheckboxes(map)}
      </>
    );
  };
  const defaults: EditButtonOptions<any, any> = {
    icon: 'construction',
    name: `token-selector-${v4()}`,
    groupLabel: 'Tokens',
    label: 'Choose',
    groupMerge: 'merge',
    activateContext: false,
    global: false,
    local: true,
    renderForm,
    initialValueHandler,
    submitValueHandler,
  };
  return { ...defaults, ...useOverrides(props) };
};

const withTokensFromData = <P extends TokensProps<P>>(Component: ComponentOrTag<P>) => {
  const WithTokensFromData = (
    props: P & EditButtonProps<TokenSelectorData> & TokenSelectorProps,
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
  // @TODO Replace this with a hash
  const key = JSON.stringify(componentData);
  return <C {...p} key={key} />;
};

const withTokenSelector = (
  nodeKey?: WithNodeKeyProps,
  defaultData?: TokenSelectorData,
  useOverrides?: UseBodilessOverrides<any, any>,
) => flowRight(
  withNodeKey(nodeKey),
  withNode,
  withNodeDataHandlers(defaultData),
  ifEditable(
    withEditButton(useEditButtonOptions(useOverrides)),
    withContextActivator('onClick'),
    // withActivatorWrapper('onClick', 'div'),
    withLocalContextMenu,
  ),
  withKeyFromData,
  withTokensFromData,
);

export default withTokenSelector;
