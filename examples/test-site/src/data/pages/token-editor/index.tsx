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
import { Page } from '@bodiless/gatsby-theme-bodiless';
import { FlowContainer } from '@bodiless/layouts-ui';
import { Section, addClasses, H1 } from '@bodiless/fclasses';
import flow from 'lodash/flow';
import Layout from '../../../components/Layout';
import withToutDemoVariation from './withToutDemoVariation';
import { asHeader1 } from '../../../components/Elements.token';
import { withFullWidthConstraint } from '../../../components/FlowContainer/token';
import withRichTextVariations from '../../../components/FlowContainer/withRichTextVariations';

const DemoFlowContainer = flow(
  withToutDemoVariation,
  withFullWidthConstraint,
  withRichTextVariations,
)(FlowContainer);

const PageTitle = asHeader1(H1);
const Intro = addClasses('my-2')(Section);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <PageTitle>Token Editor</PageTitle>
      <Intro>
        You can add a token editor for a tout to the flow container below and use
        it to explore the tokens available for touts.
      </Intro>
      <DemoFlowContainer nodeKey="demo" />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
