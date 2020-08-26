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
  withDesign, addClasses, replaceWith,
} from '@bodiless/fclasses';
import { observer } from 'mobx-react-lite';

import { flow } from 'lodash';
import {
  useNode, withNode, withSidecarNodes, withNodeKey, asReadOnly,
} from '@bodiless/core';
import { asBodilessLink, asEditable } from '@bodiless/components';
import { MenuLink, asMenuLink, asStylableList } from '@bodiless/organisms';
import Layout from '../../../components/Layout';

import MegaMenu, { asMenuClean, withPlainLinkStyles } from './MegaMenu';
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

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Chamelion</h1>
      <h3>LinkToggle</h3>
      <LinkToggle>Foo</LinkToggle>
      <h3>Chamelion</h3>
      <div className="bg-black">
        <MenuLinkChamelion />
      </div>
      <h3>Main Menu</h3>
      <MegaMenu nodeKey="list1" className="w-full" />
      <h3>Main menu as list</h3>
      <MegaMenuList nodeKey="list1" />
      <h3>Compund List</h3>
      <CompoundList />
      <h3>Keys</h3>
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
