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
  H1, withTokensFromProps, addProps, withDesign, addClasses,
} from '@bodiless/fclasses';
import { ToutClean } from '@bodiless/organisms';
import { useNode } from '@bodiless/core';
import Layout from '../../../components/Layout';
import { asHeader1, asHeader3, asBold } from '../../../components/Elements.token';
import { asEditableTout } from '../../../components/Tout';
import withTokenSelector from './withTokenSelector';
import * as availableTokens from '../../../components/Tout/token';
import withTypographySelector from './TypographySelector';
import TokenPanel from './TokenPanel';
import { Checkbox } from 'informed';

const DemoTokenSelectorTout = flow(
  asEditableTout,
  withDesign({
    Title: withTypographySelector('title-selector', undefined, () => ({ groupLabel: 'Title' })),
    Body: withTypographySelector('body-selector', undefined, () => ({ groupLabel: 'Body' })),
    // Link: withTypographySelector('link-selector', undefined, () => ({ groupLabel: 'CTA' })),
  }),
  withTokensFromProps,
  withTokenSelector('selector', undefined, () => ({ groupLabel: 'Tout', groupMerge: 'none' })),
  addProps({ availableTokens }),
)(ToutClean);

const withToutTokenNode = (Component: any) => (props: any) => {
  const { node: currentNode } = useNode();
  const node = currentNode.peer('Page$selector');
  return <Component {...props} node={node} />;
};

const Panel = flow(
  withToutTokenNode,
  addProps({ availableTokens }),
  withDesign({
    Title: asHeader3,
    Category: flow(asBold, addClasses('mt-2')),
    CheckBox: addClasses('mr-2'),
    Label: addClasses('block'),
  })
)(TokenPanel);

const PageTitle = asHeader1(H1);
export default (props: any) => (
  <Page {...props}>
    <Layout>
      <PageTitle>Tokens!</PageTitle>
      <p>Tools for tokens</p>
      <div className="flex">
        <div className="w-2/3 p-5">
          <DemoTokenSelectorTout />
        </div>
        <div className="w-1/3 p-5">
          <Panel />
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
