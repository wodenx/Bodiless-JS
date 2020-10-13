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
  addClasses, H1 as H1$, H2 as H2$, H3 as H3$, Ul, Div, withDesign,
} from '@bodiless/fclasses';
import { flow } from 'lodash';

import Layout from '../../../components/Layout';
import { SimpleMenu } from '../../../components/MegaMenu/SimpleMenu';
import {
  MenuBreadcrumbs,
  withEditableStartingTrail,
} from '../../../components/Breadcrumbs/MenuBreadcrumbs';
import { asHeader2, asHeader3, asHeader1 } from '../../../components/Elements.token';

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);
const H3 = asHeader3(H3$);
const Description = addClasses('text-sm mb-2 italic')(Div);

const MenuBreadcrumbsWithEditableStartingTrail = withEditableStartingTrail(MenuBreadcrumbs);

export default (props: any) => (
  <Page {...props}>
    {/*
      */}
    <Layout>
      <H1>Breadcrumb Demo</H1>
      <H2>Simple Menu</H2>
      <SimpleMenu nodeKey="list2" />
      <H2>Breadcrumbs</H2>
      <MenuBreadcrumbsWithEditableStartingTrail nodeKey="list2" className="my-2" />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
