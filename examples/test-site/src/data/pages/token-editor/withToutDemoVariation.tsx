import { withTokenEditorFlowContainerItem } from '@bodiless/token-editor';
import type { TokenEditorComponentDef } from '@bodiless/token-editor';
import flow from 'lodash/flow';

import { withDesign, addProps, Token } from '@bodiless/fclasses';
import { ToutComponents, ToutClean } from '@bodiless/organisms';
import { asEditableTout } from '../../../components/Tout';
import * as styleTokens from '../../../components/Tout/token';

import { tokenPanelStyles, withTokenEditorStyles } from './TokenEditor';

const tokens: TokenEditorComponentDef['tokens'] = {
  ...styleTokens,
  asEditableTout,
};

const withDemoContent = withDesign<ToutComponents>({
  Image: addProps({ src: 'https://via.placeholder.com/150' }),
  Title: addProps({ children: 'Title' }),
  Body: addProps({ children: 'Body' }),
  Link: addProps({ children: 'CTA' }),
});

const Component = withDemoContent(ToutClean);

const def = {
  Component,
  tokens: tokens as { [key: string]: Token<any> },
  name: 'Tout',
};

// @ts-ignore
export default flow(
  withTokenEditorFlowContainerItem(def, tokenPanelStyles),
  withDesign({
    Tout: withTokenEditorStyles,
  }),
);
