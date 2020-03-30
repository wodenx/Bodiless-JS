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
  withFilterToggle,
  Editable,
  asBodilessFilterItem,
  MyFormTest,
} from '@bodiless/components';
import Layout from '../../../components/Layout';
import { flow } from 'lodash';
import { stylable } from '@bodiless/fclasses';

const Item = flow(asBodilessFilterItem(), stylable)('span');

const TagableItem = withFilterToggle(Item);

// const validate = (value: string | any[]) => {
//   return !value || value.length < 5
//     ? 'Field must be at least five characters'
//     : undefined;
// };

// @ts-ignore
export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Metadata (tags) Group Demo Page</h1>
      <p>
        Below is an editable component that can take metadata (tags/groups) So
        that an end user to hide it with a filter.
      </p>
      <div className="my-3">
        <TagableItem nodeKey="linktoggle1">
          <Editable nodeKey="text" placeholder="Editable Text" />
        </TagableItem>
      </div>
    </Layout>
    <div> MY Test of InformedReactAutoComplete:</div>
    <div className="my-3">
      <MyFormTest />
    </div>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
