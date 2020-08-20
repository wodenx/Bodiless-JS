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
  startWith, withDesign, addClasses, stylable,
} from '@bodiless/fclasses';
import { withTitle } from '@bodiless/layouts';

import { flow } from 'lodash';
import { useNode, withNode } from '@bodiless/core';
import {
  withSublist, List, asEditableList, withBasicSublist, asEditable,
} from '@bodiless/components';
import Layout from '../../../components/Layout';

import asBodilessChamelion from './Chamelion';
import MainMenu from '../../../components/Menus/MainMenu';

const NodeTreePrinter = withNode(() => {
  const { node } = useNode();
  const path = node.path.join('$');
  const keys = node.keys.filter(k => k.startsWith(path));
  const chilluns = keys.map(key => (
    <>
      <h5>{key}</h5>
      <pre>{JSON.stringify(node.peer(key).data)}</pre>
    </>
  ));
  return (
    <>
      <h4>{node.path.join('$')}</h4>
      <div>{chilluns}</div>
    </>
  );
});

const Foo = () => <>Foo</>;
const Bar = () => <>Bar</>;
const Baz = () => <>Baz</>;

const Editable = flow(
  stylable,
  asEditable('cham-text', 'text'),
)('span');

const Red = addClasses('text-red-500')(Editable);
const Blue = addClasses('text-blue-500')(Editable);
const Green = addClasses('text-green-500')(Editable);

const design = {
  Red: flow(startWith(Red), withTitle('Red text')),
  Blue: flow(startWith(Blue), withTitle('Blue text')),
  Green: flow(startWith(Green), withTitle('Green text')),
};

const ExampleChamelion = flow(
  asBodilessChamelion('cham-component', { component: 'Foo' }),
  withDesign(design),
)(Red);

// const Sublist = flowRight(
//   withDesign({ Title: addClasses('py-5') }),
//   asEditableList,
// )(List);
//
// const MainList = withBasicSublist(Sublist)(List)

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Chamelion</h1>
      <h3>Chamelion</h3>
      <ExampleChamelion />
      <h3>Main Menu</h3>
      <MainMenu nodeKey="list1" className="w-full" />
      <h3>List Representation of Main Menu</h3>
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
