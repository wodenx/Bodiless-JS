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
  withDesign, addClasses, replaceWith, H3,
} from '@bodiless/fclasses';
import { observer } from 'mobx-react-lite';

import { flow } from 'lodash';
import {
  useNode, withNode, withSidecarNodes, withNodeKey, asReadOnly,
} from '@bodiless/core';
import { asBodilessLink, asEditable } from '@bodiless/components';
import { MenuLink, asMenuLink, asStylableList } from '@bodiless/organisms';
import Layout from '../../../components/Layout';

import MegaMenu, { asMenuClean, asBreadcrumbs } from './MegaMenu';
import asChamelionTitle from './asChamelionTitle';
import withBodilessLinkToggle from './LinkToggle';
import asBodilessList, { asSubList } from './asBodilessList';
// import { withEditorSimple } from '../../../components/Editors';
import { asPlainLinks } from './asMenu';

const withEditorSimple = asEditable;

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

const Foo = (props: any) => <div id="foo" {...props} />;

const MenuLinkChamelion = flow(
  asChamelionTitle,
  withDesign({
    Link: addClasses('italic'),
  }),
)(Foo);

const asLinkToggle = flow(
  replaceWith(MenuLink),
  withSidecarNodes(
    withBodilessLinkToggle(
      asBodilessLink('link'),
    ),
  ),
  asEditable('text', 'Link Toggle'),
  withNode,
  withNodeKey('link-toggle'),
);
const LinkToggle = asLinkToggle(Fragment);

const asMenuLinkList = flow(
  withDesign({
    Title: asMenuLink(withEditorSimple),
  }),
  asStylableList,
);

const asIndentedSubList = flow(
  asSubList,
  asMenuLinkList,
  withDesign({
    Item: addClasses('pl-5'),
  }),
);

const asInline = withDesign({
  Wrapper: addClasses('inline'),
  Item: addClasses('inline mr-5'),
});

const withBreadcrumbStyles = flow(
  withDesign({
    Wrapper: addClasses('inline'),
    Item: withDesign({
      Basic: asInline,
      Touts: asInline,
      Column: flow(
        asInline,
        withDesign({ Item: asInline }),
      ),
    }),
  }),
);

const withPadding = withDesign({
  Item: addClasses('pl-5'),
});

const withPlainLinkStyles = withDesign({
  Item: withDesign({
    Basic: withPadding,
    Touts: withPadding,
    Columns: flow(
      withPadding,
      withDesign({ Item: withPadding }),
    ),
  }),
});

const CompoundList = flow(
  asBodilessList('clist'),
  asMenuLinkList,
  withDesign({
    Item: asIndentedSubList,
  }),
)('ul');

const MegaMenuList = flow(
  asMenuClean,
  asPlainLinks,
  withPlainLinkStyles,
  asReadOnly,
)('ul');

const MegaMenuBreadcrumbs = flow(
  asMenuClean,
  asPlainLinks,
  // asBreadcrumbs,
  withBreadcrumbStyles,
  asReadOnly,
)('ul');

const H = addClasses('mt-5 text-l')(H3);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Chamelion</h1>
      <H>LinkToggle</H>
      <LinkToggle>Foo</LinkToggle>
      <H>Chamelion</H>
      <div className="bg-black">
        <MenuLinkChamelion />
      </div>
      <H>Main Menu</H>
      <MegaMenu nodeKey="list1" className="w-full" />
      <H>Main menu as list</H>
      <MegaMenuList nodeKey="list1" />
      <H>Breadcrumbs</H>
      <MegaMenuBreadcrumbs nodeKey="list1" />
      <H>Keys</H>
      <NodeTreePrinter nodeKey="list1" />
      <H>Compund List</H>
      <CompoundList />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
