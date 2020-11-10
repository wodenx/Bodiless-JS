/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { graphql } from 'gatsby';
import { flow } from 'lodash';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  H1, withTokensFromProps, addProps, withDesign, replaceWith,
} from '@bodiless/fclasses';
import { ToutClean } from '@bodiless/organisms';
import {
  withActivateOnEffect, withNodeKey,
} from '@bodiless/core';
import { FlowContainer } from '@bodiless/layouts-ui';
import { withTitle, withDesc } from '@bodiless/layouts';
import Layout from '../../../components/Layout';
import { asHeader1 } from '../../../components/Elements.token';
import { asEditableTout } from '../../../components/Tout';
import * as availableTokens from '../../../components/Tout/token';
import { withTypographyTokenPanel } from './TypographySelector';
import TokenPanelWrapper, { withTokenPanelPane } from './TokenPanelWrapper';
import withReactivateOnRemount from './withRectivateOnRemount';
import TokenPrinter from './TokenPrinter';

const Foo = addProps({ tokens: ['c', 'd'] })(TokenPrinter);
const Bing = addProps({ tokens: ['e', 'f'] })(TokenPrinter);
const Bar = addProps({ components: { Bing } })(TokenPrinter);
const Baz = TokenPrinter;

const TokenPrinterWrapper = () => (
  <pre>
    <code>
      <TokenPrinter tokens={['a', 'b']} components={{ Foo, Bar, Baz }} />
    </code>
  </pre>
);

const DemoTokenPanelTout = flow(
  withDesign({
    Title: withReactivateOnRemount('title'),
    Body: withReactivateOnRemount('body'),
    Image: withReactivateOnRemount('image'),
    Link: withReactivateOnRemount('link'),
  }),
  asEditableTout,
  withDesign({
    Title: flow(
      withTypographyTokenPanel('title-selector'),
      addProps({ tokenPanelTitle: 'Title Tokens' }),
    ),
    Body: flow(
      withTypographyTokenPanel('body-selector'),
      addProps({ tokenPanelTitle: 'Body Tokens' }),
    ),
  }),
  withTokensFromProps,
  withReactivateOnRemount('tout'),
  withTokenPanelPane('selector'),
  addProps({ availableTokens, tokenPanelTitle: 'Tout Tokens' }),
  withActivateOnEffect,
)(ToutClean);

const PageTitle = asHeader1(H1);

const DemoFlowContainer = flow(
  withDesign({
    Tout: flow(
      replaceWith(DemoTokenPanelTout),
      withTitle('Tout'),
      withDesc('A way to tout a call to Action.'),
    ),
  }),
  addProps({ maxComponents: 1 }),
  withNodeKey('demo'),
)(FlowContainer);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <PageTitle>Tokens!</PageTitle>
      <p>Tools for tokens</p>
      <div className="flex">
        <div className="w-2/3 p-5">
          <DemoFlowContainer />
          <TokenPrinterWrapper />
        </div>
        <div className="w-1/3 p-5">
          <TokenPanelWrapper />
        </div>
      </div>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
