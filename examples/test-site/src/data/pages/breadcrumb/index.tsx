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

/* eslint max-len: 0 */

import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import { asReadOnly } from '@bodiless/core';
import { withBreadcrumbStore } from '@bodiless/components';
import {
  addClasses, H1 as H1$, H2 as H2$, P as P$, withDesign,
} from '@bodiless/fclasses';
import { flow } from 'lodash';

import Layout from '../../../components/Layout';
import BodilessMenu from '../../../components/Menu/Menu';
import Breadcrumbs, { DEFAULT_STARTING_TRAIL_NODE_KEY } from '../../../components/Breadcrumbs/MenuBreadcrumbs';
import {
  withEditableStartingTrail,
  withStartingTrailIcon,
  withNonLinkableItems,
  withBoldedFinalTrail,
  withVerticalBarSeparator,
  withSlashSeparator,
  withHiddenCurrentPageItem,
} from '../../../components/Breadcrumbs/MenuBreadcrumbs.token';
import { asHeader2, asHeader1, asItalic } from '../../../components/Elements.token';

const MenuBreadcrumbs = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}Default`,
    'Enter item',
  ),
)(Breadcrumbs);

const BreadcrumbWithStartingTrailIcon = withStartingTrailIcon(
  `${DEFAULT_STARTING_TRAIL_NODE_KEY}Icon`,
)(Breadcrumbs);

const BreadcrumbWithNonLinkableItems = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}NonLinkable`,
    'Enter item',
  ),
  withNonLinkableItems,
)(Breadcrumbs);

const BreadcrumbWithBoldableFinalItem = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}BoldedFinal`,
    'Enter item',
  ),
  withBoldedFinalTrail,
)(Breadcrumbs);

const BreadcrumbWithVerticalBarSeparator = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}VerticalBar`,
    'Enter item',
  ),
  withVerticalBarSeparator,
)(Breadcrumbs);

const BreadcrumbWithSlashSeparator = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}SlashSeparator`,
    'Enter item',
  ),
  withSlashSeparator,
)(Breadcrumbs);

const BreadcrumbWithHiddenCurrentPageItem = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}CurrentPage`,
    'Enter item',
  ),
  withHiddenCurrentPageItem,
)(Breadcrumbs);

const MegaMenuBreadcrumbWithNonLinkableItems = flow(
  withEditableStartingTrail(
    `${DEFAULT_STARTING_TRAIL_NODE_KEY}MegaMenuNonLinkable`,
    'Enter item',
  ),
  withDesign({
    StartingTrail: asReadOnly,
  }),
  withNonLinkableItems,
)(Breadcrumbs);

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);
const P = flow(asItalic, addClasses('text-sm'))(P$);

const BreadcrumbProvider = withBreadcrumbStore(Fragment);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <H1>Breadcrumb Demo</H1>
      <BreadcrumbProvider>
        <BodilessMenu nodeKey="bodilessMenu" />
        <H2>Breadcrumbs with editable starting trail</H2>
        <MenuBreadcrumbs nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with starting trail icon</H2>
        <BreadcrumbWithStartingTrailIcon nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with non-linkable Middle Trail group</H2>
        <BreadcrumbWithNonLinkableItems nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with boldable final trail item</H2>
        <BreadcrumbWithBoldableFinalItem nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with vertical bar separator</H2>
        <BreadcrumbWithVerticalBarSeparator nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with slash separator</H2>
        <BreadcrumbWithSlashSeparator nodeKey="bodilessMenu" className="my-2" />
        <H2>Breadcrumbs with hidden current page item</H2>
        <P>
          {`
          This example does not display custom final trail item and does not display current page item
          derived from menu. For instance, when the trail derived from menu is Components -> Breadcrumb
          and current page is /breadcrumb, then this test component will render just Home -> Components
        `}
        </P>
        <BreadcrumbWithHiddenCurrentPageItem nodeKey="bodilessMenu" className="my-2" />
        <H2>MegaMenu breadcrumbs with non-editable starting trail and non-linkable Middle Trail group</H2>
        <MegaMenuBreadcrumbWithNonLinkableItems nodeKey="bodilessMenu" className="my-2" />
      </BreadcrumbProvider>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
