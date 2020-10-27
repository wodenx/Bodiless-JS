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
  addClasses, H1 as H1$, H2 as H2$,
} from '@bodiless/fclasses';
import { flow } from 'lodash';

import Layout from '../../../components/Layout';
import { SimpleMenu } from '../../../components/MegaMenu/SimpleMenu';
import MenuBreadcrumbs from '../../../components/Breadcrumbs/MenuBreadcrumbs';
import {
  withEditableStartingTrail,
  withStartingTrailIcon,
  withNonLinkableItems,
  withEditableFinalTrail,
  withBoldedFinalTrail,
  withVerticalBarSeparator,
  withSlashSeparator,
} from '../../../components/Breadcrumbs/MenuBreadcrumbs.token';
import { asHeader2, asHeader1 } from '../../../components/Elements.token';

const STARTING_TRAIL_NODE_KEY = 'startingTrail';
const FINAL_TRAIL_NODE_KEY = 'finalTrail';

const BreadcrumbWithEditableStartingTrail = withEditableStartingTrail(
  STARTING_TRAIL_NODE_KEY,
  'Enter Item',
)(MenuBreadcrumbs);
const BreadcrumbWithStartingTrailIcon = withStartingTrailIcon(MenuBreadcrumbs);
const BreadcrumbWithNonLinkableItems = withNonLinkableItems(MenuBreadcrumbs);
const BreadcrumbWithBoldableFinalItem = flow(
  withEditableFinalTrail(FINAL_TRAIL_NODE_KEY, 'Enter Item'),
  withBoldedFinalTrail,
)(MenuBreadcrumbs);
const BreadcrumbWithVerticalBarSeparator = withVerticalBarSeparator(MenuBreadcrumbs);
const BreadcrumbWithSlashSeparator = withSlashSeparator(MenuBreadcrumbs);

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <H1>Breadcrumb Demo</H1>
      <H2>Simple Menu</H2>
      <SimpleMenu nodeKey="list2" />
      <H2>Breadcrumbs with editable starting trail</H2>
      <BreadcrumbWithEditableStartingTrail nodeKey="list2" className="my-2" />
      <H2>Breadcrumbs with starting trail icon</H2>
      <BreadcrumbWithStartingTrailIcon nodeKey="list2" className="my-2" />
      <H2>Breadcrumbs with non-linkable items</H2>
      <BreadcrumbWithNonLinkableItems nodeKey="list2" className="my-2" />
      <H2>Breadcrumbs with boldable final trail item</H2>
      <BreadcrumbWithBoldableFinalItem nodeKey="list2" className="my-2" />
      <H2>Breadcrumbs with vertical bar separator</H2>
      <BreadcrumbWithVerticalBarSeparator nodeKey="list2" className="my-2" />
      <H2>Breadcrumbs with slash separator</H2>
      <BreadcrumbWithSlashSeparator nodeKey="list2" className="my-2" />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
