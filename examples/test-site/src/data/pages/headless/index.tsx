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

import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  addClasses, H1 as H1$, H2 as H2$,
} from '@bodiless/fclasses';
import { flow } from 'lodash';

import Layout from '../../../components/Layout';
import { asHeader2, asHeader1 } from '../../../components/Elements.token';

// import MainMenu, { MenuContent } from './MainMenu';
// import TacoContainer, { TacoContent } from './TacoList';
// import ProductTacoContainer from './ProductTacoList';
import TacoContainer, { TacoContent } from '../../../components/headless/TacoContainer';
import { NodeTreePrinter } from './DataPrinter';
import withRefreshButton from '../../../components/headless/withRefreshButton';

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);

const RefreshButton = withRefreshButton(Fragment);

export default (props: any) => (
  <Page {...props}>
    <RefreshButton>
      <Layout>
        <H1>Headless Home Page</H1>
        {/* <MainMenu /> */}
        <TacoContainer />
        {/* <ProductTacoContainer /> */}
        <H2>Taco Data</H2>
        <div className="overflow-x-scroll">
          <NodeTreePrinter nodeKey="tacos-1" title="Local Data" />
          <TacoContent />
        </div>
        <H2>Menu Data</H2>
        <div className="overflow-x-scroll">
          <NodeTreePrinter nodeKey="menu" title="Local Data" />
          {/* <MenuContent /> */}
        </div>
      </Layout>
    </RefreshButton>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
