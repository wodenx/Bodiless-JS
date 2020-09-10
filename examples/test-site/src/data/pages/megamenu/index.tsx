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

import React, { Fragment, ComponentType } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  withDesign, addClasses, replaceWith, H3, stylable, H2,
} from '@bodiless/fclasses';
import { observer } from 'mobx-react-lite';

import { flow } from 'lodash';
import {
  useNode, withNode, asReadOnly,
} from '@bodiless/core';

// Workaround for multiple slate editor issue.
import {
  asEditable as withEditorSimple,
  asBodilessList,
  asSubList,
} from '@bodiless/components';
import {
  asMegaMenuMain, asMegaMenuBreadcrumbs, asMegaMenuBase, withMegaMenuDesign,
  asStylableList, asMenuTout, asMenuLink, asSimpleMenuBase, withSimpleMenuDesign,
} from '@bodiless/organisms';

// import { withEditorSimple } from '../../../components/Editors';

import Layout from '../../../components/Layout';
import withMenuStyles, { withMenuToutStyles } from '../../../components/MegaMenu/MegaMenu.token';
import asChamelionTitle from './asChamelionTitle';
import { withToutEditors } from '../../../components/Tout';

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
  stylable,
  withDesign({
    Link: addClasses('italic'),
  }),
)(Foo);

const withTitleEditor = withEditorSimple('text', 'Menu Item');

const LinkToggle = asMenuLink(withTitleEditor)(Fragment);

const asMenuLinkList = flow(
  withDesign({
    Title: asMenuLink(withTitleEditor),
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

const withMenuToutEditors = flow(
  withToutEditors,
  withDesign({
    Title: flow(
      replaceWith(H2),
      // We set the title editor to match the one in asMenuLink
      withEditorSimple('text', 'Title'),
    ),
  }),
);

const asMenuTout$ = flow(
  asMenuTout(withMenuToutEditors),
  withMenuToutStyles,
);

const MegaMenu = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asMegaMenuMain(
    withMenuStyles,
    withDesign({
      Item: withDesign({
        Touts: withDesign({
          Title: asMenuTout$,
        }),
      }),
    }),
  ),
)(Fragment);

const MegaMenuList = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withMegaMenuDesign({
    Item: addClasses('pl-5'),
  }),
  asReadOnly,
)('ul');

const asInline = withDesign({
  Wrapper: withDesign({
    WrapperItem: flow(stylable, addClasses('inline pl-5')),
    List: flow(stylable, addClasses('inline')),
  }),
  Item: addClasses('inline pl-5'),
});

const MegaMenuBreadcrumbs = flow(
  asMegaMenuBase(),
  withMegaMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  asMegaMenuBreadcrumbs,
  withMegaMenuDesign(asInline),
  asReadOnly,
)('ul');

const SimpleMenuList = flow(
  asSimpleMenuBase(),
  withSimpleMenuDesign({
    Title: asMenuLink(withTitleEditor),
  }),
  withSimpleMenuDesign({
    Item: addClasses('pl-5'),
  }),
  // asReadOnly,
)('ul') as ComponentType<any>;

const H = addClasses('mt-5 text-l')(H3);

export default (props: any) => (
  <Page {...props}>
    {/*
      */}
    <Layout>
      <h1 className="text-3xl font-bold">Menu V2</h1>
      <SimpleMenuList nodeKey="list2" />
      <H>Keys</H>
      <NodeTreePrinter nodeKey="list2" />
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
    {/*
      */}
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
