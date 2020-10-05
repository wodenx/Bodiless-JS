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
  addClasses, H1 as H1$, H2 as H2$, H3 as H3$,
} from '@bodiless/fclasses';
import { observer } from 'mobx-react-lite';
import { flow } from 'lodash';
import {
  useNode, withNode,
} from '@bodiless/core';

import Layout from '../../../components/Layout';
import MegaMenu, { MegaMenuList, MegaMenuBreadcrumbs } from '../../../components/MegaMenu/MegaMenu';
import { SimpleMenu, SimpleMenuList } from '../../../components/MegaMenu/SimpleMenu';
import { asHeader2, asHeader3, asHeader1 } from '../../../components/Elements.token';

import ContentfulSimpleMenu, { MenuContent } from '../../../components/MegaMenu/ContentfulSimpleMenu';

const NodeTreePrinter$ = () => {
  const { node } = useNode();
  const path = node.path.join('$');
  const keys = node.keys.filter(k => k.startsWith(path));
  const chilluns = keys.map(key => (
    <div key={key}>
      {key.split('$').slice(1).join('$')}
      <pre className="pl-5">{JSON.stringify(node.peer(key).data)}</pre>
    </div>
  ));
  return (
    <>
      <h4>{node.path.join('$')}</h4>
      <div>{chilluns}</div>
    </>
  );
};
const NodeTreePrinter = flow(observer, withNode)(NodeTreePrinter$);

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);
const H3 = flow(addClasses('pt-5'), asHeader3)(H3$);

export default (props: any) => (
  <Page {...props}>
    {/*
      */}
    <Layout>
      <H1>Menu V2</H1>
      <H2>Simple Menu</H2>
      <ContentfulSimpleMenu nodeKey="list2" />
      <H3>Simple Menu as List</H3>
      <SimpleMenuList nodeKey="list2" />
      <H3>Simple Menu Data</H3>
      <NodeTreePrinter nodeKey="list2" />
      <H3>Content</H3>
      <MenuContent />

      <H2>Mega Menu</H2>
      <MegaMenu nodeKey="list1" className="w-full" />
      <H3>Mega Menu as list</H3>
      <MegaMenuList nodeKey="list1" />
      <H3>Mega Menu Breadcrumbs</H3>
      <MegaMenuBreadcrumbs nodeKey="list1" />
      <H3>Mega Menu Data</H3>
      <NodeTreePrinter nodeKey="list1" />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
