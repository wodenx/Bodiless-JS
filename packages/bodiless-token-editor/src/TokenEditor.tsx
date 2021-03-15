import React, { FC } from 'react';
import { createHash } from 'crypto';
import type { ComponentType } from 'react';
import {
  Div, H2, DesignableComponentsProps, designable, addClasses, withDesign, HOC,
  addProps, asToken, startWith, Token, H3, replaceWith, flowIf, Design,
} from '@bodiless/fclasses';
import { FlowContainer } from '@bodiless/layouts-ui';
import {
  withTokensFromProps, withTokenPanelPane,
  withTokenNamesFromData, TokenPrinter,
  withTokenPanelButton,
} from '@bodiless/tokens';
import type { TokenPanelComponents } from '@bodiless/tokens';
import {
  withNodeKey, WithNodeKeyProps, withNode, useNode, withNodeDataHandlers,
  withDefaultContent,
} from '@bodiless/core';
import flow from 'lodash/flow';
import { ifComponentSelector } from '@bodiless/layouts';

const DEMO_NODE_KEY = 'demo';

/**
 * @private
 *
 * Obtains a hash of the current nodeKey. Used to create a unique id for the target
 * component.
 */
const useNodeKeyHash = () => {
  const { node } = useNode();
  return createHash('md5').update(node.path.join('$')).digest('hex');
};

type TokenEditorComponents = {
  Wrapper: ComponentType<any>,
  Title: ComponentType<any>,
  Container: ComponentType<any>,
  DetailsWrapper: ComponentType<any>,
  DetailsTitle: ComponentType<any>,
  DetailsBody: ComponentType<any>
  Printer: ComponentType<any>,
};

const tokenEditorComponents: TokenEditorComponents = {
  Wrapper: Div,
  Title: H2,
  Container: FlowContainer,
  DetailsWrapper: Div,
  DetailsTitle: H3,
  DetailsBody: Div,
  Printer: TokenPrinter,
};

type TokenEditorProps = DesignableComponentsProps<TokenEditorComponents>;

const TokenEditorBase: FC<TokenEditorProps> = ({ components: C }) => (
  <C.Wrapper>
    <C.Title />
    <C.Container />
    <C.DetailsWrapper>
      <C.DetailsTitle />
      <C.DetailsBody>
        <C.Printer />
      </C.DetailsBody>
    </C.DetailsWrapper>
  </C.Wrapper>
);

/**
 * A Token editor is a tool for displaying and selecting among thetokens
 * which are available for a component. Selected tokens are saved as data.
 */
const TokenEditorClean = designable<TokenEditorComponents>(
  tokenEditorComponents, 'TokenBrowser',
)(TokenEditorBase);

/**
 * @private
 *
 * Creates an HOC which wraps the target component with the node belonging to
 * the first item in the flow container whose data is located at the specified
 * node key.
 *
 * @param nodeKey
 * The nodeKey identifying where the flow container data is stored.
 */
const withFlowContainerFirstItemNode = (nodeKey: string) => <P extends object>(
  Component: ComponentType<P & WithNodeKeyProps>,
) => {
  const ComponentWithNode = withNode(Component);
  const WithFlowContainerFirstItemNode = (props: P) => {
    const { node } = useNode<any>();
    const { items } = node.data;
    const item = items && items[0];
    return item?.uuid
      ? <ComponentWithNode {...props} nodeKey={items[0].uuid} />
      : <Component {...props} />;
  };
  return flow(
    withNode,
    withNodeKey(nodeKey),
  )(WithFlowContainerFirstItemNode);
};

/**
 * Connects a token editor to token data.
 */
const withTokenEditorData = (nodeKey?: WithNodeKeyProps) => asToken(
  withDesign({
    Container: asToken(
      addProps({ maxComponents: 1, minComponents: 1 }) as HOC,
      withNodeKey(DEMO_NODE_KEY) as HOC,
    ),
    Printer: asToken(
      flowIf(({ tokens = [] }) => tokens.length === 0)(
        replaceWith(() => <>No tokens selected.</>),
      ) as Token,
      withTokenNamesFromData,
      withNodeDataHandlers() as Token,
      withFlowContainerFirstItemNode(DEMO_NODE_KEY) as HOC,
    ),
  }) as HOC,
  withNode as Token,
  withNodeKey(nodeKey) as Token,
);

const TokenEditor = withTokenEditorData()(TokenEditorClean);

/**
 * Defines a component which can be added to a Token Editor
 */
type TokenEditorComponentDef = {
  /**
   * The name of the component. Used to create the design key of the component
   * within the editor, and for various titles.
   */
  name?: string,
  /**
   * The component to add.
   */
  Component: ComponentType<any>,
  /**
   * An object listing the tokens which will be available to apply to the component.
   * The keys are token names (used to generate checkboxes and to produce code
   * snippets).  The values are the tokens themselvs.
   */
  tokens: { [key: string]: Token },
};

/**
 * Creates an HOC which adds a component to a token editor.
 *
 * @param def
 * The definition of the component to be added.
 *
 * @param panelDesign
 * Optional design to apply to the token panel for this component.
 */
const withTokenEditorComponent = (
  def: TokenEditorComponentDef,
  panelDesign: Design<TokenPanelComponents> = {},
) => {
  const { Component, tokens, name = 'Demo' } = def;
  const design = {
    [name]: asToken(
      startWith(Component) as HOC,
      withTokensFromProps,
      withTokenPanelPane(),
      addProps({ availableTokens: tokens }) as HOC,
      withTokenPanelButton({ panelDesign }) as HOC,
    ),
  };
  return flow(
    withDesign({
      Container: withDesign(design),
    }) as HOC,
    withDefaultContent(() => ({
      [DEMO_NODE_KEY]: {
        items: [
          {
            // We need a unique id bc this is used to create the context id for the item
            // and we might have more than one on the page. The id must also be persistent
            // so we don't lose data.  The node meets both these constraints.
            uuid: `${name}-${useNodeKeyHash()}`,
            wrapperProps: {
              className: 'w-full',
            },
            type: name,
          },
        ],
      },
    })),
  );
};

/**
 * Creates an HOC which can be used to add a token editor to a flow container.
 *
 * @param def
 * The definition of the component to be added.
 *
 * @param panelDesign
 * Optional design to apply to the token panel for this component.
 *
 * @return
 * HOC which should be applied to a flow container to add the token editor
 * as an available component.
 *
 * @example
 * ```
 * const withMyTokenEditorVariation = withTokenEditorVariation({
 *   name: 'My Component',
 *   component: MyComponent,
 *   tokens: mapOfTokensAvailableForMyComponent,
 * });
 *
 * const flowContainerWithEditor = withMyTokenEditorVariation(FlowContainer);
 * ```
 */
const withTokenEditorVariation = (
  def: TokenEditorComponentDef,
  panelDesign?: Design<TokenPanelComponents>,
) => {
  const { name = 'Demo' } = def;
  return withDesign({
    [name]: asToken(
      startWith(TokenEditor) as HOC,
      withTokenEditorComponent(def, panelDesign),
      ifComponentSelector(
        withDesign({
          // Counteract the white text of the context menu form.
          // @todo move this to bodiless layouts ui
          Wrapper: addClasses('text-black'),
        }),
      ) as Token,
      {
        categories: {
          Type: ['Token Browser'],
        },
        title: `"${name}" Token Browser`,
      },
    ),
  });
};

export {
  TokenEditorClean, TokenEditor, withTokenEditorComponent, withTokenEditorVariation,
};
