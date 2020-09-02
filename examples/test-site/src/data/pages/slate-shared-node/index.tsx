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

import { flow } from 'lodash';
import {
  asReadOnly,
} from '@bodiless/core';
import Tooltip from 'rc-tooltip';
import Layout from '../../../components/Layout';
import { withEditorSimple } from '../../../components/Editors';

const Editor1 = withEditorSimple('shared-editor', 'Editor 1')('div');
const Editor2 = flow(
  withEditorSimple('shared-editor', 'Editor 2'),
  asReadOnly,
)('div');

const Editor3 = withEditorSimple('shared-editor-tooltip', 'Editor 3')('div');
const Editor4 = flow(
  withEditorSimple('shared-editor-tooltip', 'Editor 4'),
  asReadOnly,
)('div');

const Editor5 = flow(
  withEditorSimple('shared-editor-tooltip-2', 'Editor 5'),
  asReadOnly,
)('div');
const Editor6 = withEditorSimple('shared-editor-tooltip-2', 'Editor 6')('div');

const Editor7 = withEditorSimple('single-editor-tooltip', 'Editor 7')('div');

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Slate Editors Sharing Node</h1>
      <h2 className="text-2xl">Basic</h2>
      <p>
        These 2 editors share the same node.  The second is read-only, and
        they seem to function properly
      </p>
      <h3 className="text-xl">Editable</h3>
      <Editor1 />
      <h3 className="text-xl">ReadOnly</h3>
      <Editor2 />
      <hr />
      <h2 className="text-2xl">Editor in Tooltip</h2>
      <p>
        The first editor below is in a tooltip and shares a node with the second.
        The one in the tooltip is editable, the second is read-only. 
        The editor is completely non-functional
      </p>
      <h3 className="text-xl">Editable</h3>
      <Tooltip placement="topLeft" overlay={<Editor4 className="w-24" />}>
        <div>Hover for Editor 3</div>
      </Tooltip>
      <h3 className="text-xl">ReadOnly</h3>
      <Editor3 />
      <hr />
      <h2 className="text-2xl">Read-only Editor in Tooltip</h2>
      <p>
        The first editor below is in a tooltip and shares a node with the second.
        The one in the tooltip is read-only, the second is editable. 
        Here, everything seems to work as expected.
      </p>
      <h3 className="text-xl">ReadOnly</h3>
      <Tooltip placement="topLeft" overlay={<Editor5 className="w-24" />}>
        <div>Hover for Editor 5</div>
      </Tooltip>
      <h3 className="text-xl">Editable</h3>
      <Editor6 />
      <h2 className="text-2xl">Single Editor in Tooltip</h2>
      <p>
        The following is an editor in a tooltip which does not share
        a node. It also seems to function as expected.
      </p>
      <h3 className="text-xl">Editable</h3>
      <Tooltip placement="topLeft" overlay={<Editor7 className="w-24" />}>
        <div>Hover for Editor 7</div>
      </Tooltip>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
