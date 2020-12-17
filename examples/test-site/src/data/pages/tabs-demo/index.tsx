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

import {
  asEditable,
} from '@bodiless/components';
import { flow } from 'lodash';
import { withDesign } from '@bodiless/fclasses';
import Layout from '../../../components/Layout';
import asBodilessTabs from './asBodilessTabs';
import MockTabs from './MockTabs';

const EditableTabs = flow(
  asBodilessTabs('listData'),
  withDesign({
    Item: withDesign({
      TabContent: asEditable('content', 'Content'),
      TabName: asEditable('name', 'Name'),
    }),
  }),
)(MockTabs);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Demo of editable tabs</h1>
      <p>The mock tabs below are editable</p>
      <EditableTabs />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
