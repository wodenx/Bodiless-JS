import { ContentNode } from '@bodiless/core/src';
import React, {
  ComponentType, HTMLProps, FC, useCallback, Fragment,
} from 'react';
import {
  DesignableComponentsProps, designable, Div, H4, H5,
  Label as StylableLabel, Input,
} from '@bodiless/fclasses';
import { flow } from 'lodash';
import { observer } from 'mobx-react-lite';
import { TokenSelectorProps, TokenSelectorData } from './withTokenSelector';
import TokenMap from './TokenMap';

type TokenPanelComponents = {
  Wrapper: ComponentType<any>,
  Body: ComponentType<any>,
  Title: ComponentType<any>,
  Category: ComponentType<any>,
  Label: ComponentType<HTMLProps<HTMLLabelElement>>,
  CheckBox: ComponentType<HTMLProps<HTMLInputElement>>,
};

const tokenPanelComponents: TokenPanelComponents = {
  Wrapper: Div,
  Body: Div,
  Title: H4,
  Category: H5,
  Label: StylableLabel,
  CheckBox: Input,
};

export type TokenPanelProps = TokenSelectorProps & {
  node: ContentNode<TokenSelectorData>,
  title?: string,
} & DesignableComponentsProps<TokenPanelComponents>;

const TokenPanelBase: FC<TokenPanelProps> = props => {
  const {
    node, availableTokens, components, title = 'Tokens',
  } = props;
  const map = new TokenMap<any>();
  map.add(availableTokens);
  const {
    Wrapper, Title, Label, Category, CheckBox, Body,
  } = components;
  const { tokens = [] } = node.data;
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tokenSet = new Set(node.data.tokens);
    if (e.target.checked) tokenSet.add(e.target.name);
    else tokenSet.delete(e.target.name);
    node.setData({ tokens: Array.from(tokenSet) });
  }, [node]);
  const checkboxes = map.categories.map(cat => (
    <Fragment key={cat}>
      <Category>{cat}</Category>
      {map.namesFor(cat).map(name => (
        <Label key={name}>
          <CheckBox type="checkbox" name={name} onChange={onChange} checked={tokens.includes(name)} />
          {name}
        </Label>
      ))}
    </Fragment>
  ));
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Body>
        {checkboxes}
      </Body>
    </Wrapper>
  );
};

const TokenPanel = flow(
  observer,
  designable(tokenPanelComponents),
)(TokenPanelBase);

export default TokenPanel;
