import React, { ComponentType, FC } from 'react';
import {
  withMenuOptions, WithNodeKeyProps, withNodeKey, withNode,
  withNodeDataHandlers, withContextActivator, useEditContext,
  useNode,
} from '@bodiless/core';
import { asAccodionTitle, asAccordionBody, asAccordionWrapper } from '@bodiless/organisms';
import { v4 } from 'uuid';
import { flow, flowRight } from 'lodash';
import { observer } from 'mobx-react-lite';
import { withoutProps, withDesign, addClasses } from '@bodiless/fclasses';
import type { TokenPanelProps } from './TokenPanel';
import {
  TokenSelectorProps, TokenSelectorData, withKeyFromData, withTokensFromData,
} from './withTokenSelector';
import TokenPanel from './TokenPanel';
import { asHeader3, asBold, asPrimaryColorBackground } from '../../../components/Elements.token';

// class TokenPanelStore {
//   @observable
//   activeContext: TokenPanelContextT
// }
//
// type TokenPanelContextType = TokenPanelProps & {
//   parent?: TokenPanelProps,
// };
// const TokenPanelContext = createContext<TokenPanelContextType|undefined>(undefined);

const TOKEN_PANEL_CONTEXT_TYPE = 'token-panel';

type WithTokenPanelsProps = {
  panelsProps: Partial<TokenPanelProps>[],
};

const withTokenPanelsProps = <P extends object>(
  Component: ComponentType<P & WithTokenPanelsProps>,
) => {
  const WithTokenPanelsProps = observer((props: P) => {
    const context = useEditContext();
    const { contextMenuOptions } = context;
    const panelsProps = contextMenuOptions
      .filter(op => op.context.type === TOKEN_PANEL_CONTEXT_TYPE)
      .map((op): Partial<TokenPanelProps> => ({
        ...op.handler(undefined),
        title: typeof op.label === 'function' ? op.label() : op.label,
      }));
    return <Component {...props} panelsProps={panelsProps} />;
  });
  return WithTokenPanelsProps;
};
const useMenuOptions = (props: TokenSelectorProps & { tokenPanelTitle?: string }) => {
  const { node } = useNode();
  const { availableTokens, tokenPanelTitle } = props;
  const option = {
    name: `token-panel-activator-${v4()}`,
    label: tokenPanelTitle || 'Tokens',
    isHidden: true,
    isEnabled: false,
    handler: () => ({ node, availableTokens }),
  };
  return [option];
};

const withTokenPanelPane = (
  nodeKey?: WithNodeKeyProps,
  defaultData?: TokenSelectorData,
) => flowRight(
  withNodeKey(nodeKey),
  withNode,
  withNodeDataHandlers(defaultData),
  withMenuOptions({ useMenuOptions, type: TOKEN_PANEL_CONTEXT_TYPE, name: 'Token Panel' }),
  withoutProps('setComponentData', 'tokenPanelTitle'),
  withContextActivator('onClick'),
  withKeyFromData,
  withTokensFromData,
);

const FancyPanel = withDesign({
  Title: flow(asAccodionTitle, asHeader3, asPrimaryColorBackground),
  Wrapper: asAccordionWrapper,
  Body: asAccordionBody,
  Category: flow(asBold, addClasses('mt-2')),
  CheckBox: addClasses('mr-2'),
  Label: addClasses('block'),
})(TokenPanel);

const TokenPanelWrapper: FC<WithTokenPanelsProps> = props => {
  const { panelsProps } = props;
  const content = (panelsProps.length > 0)
    ? panelsProps.map(p => <FancyPanel {...p} key={p.node.path.join('$')} />)
    : <div>No component is selected.</div>;
  return (
    <div data-bl-activator>
      {content}
    </div>
  );
};

export default flow(
  withTokenPanelsProps,
)(TokenPanelWrapper);

export { withTokenPanelPane };
