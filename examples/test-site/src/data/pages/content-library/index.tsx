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

import { asEditable } from '@bodiless/components';
import {
  useNode, withContextActivator, withLocalContextMenu, withDefaultContent, withNode, withNodeKey,
} from '@bodiless/core';
import { H1, H2, addProps } from '@bodiless/fclasses';
import { withContentLibrary } from '@bodiless/layouts';
import { flow } from 'lodash';
import { observer } from 'mobx-react-lite';
import Layout from '../../../components/Layout';

import { asHeader1, asHeader2 } from '../../../components/Elements.token';

const Title = asHeader1(H1);
const SectionTitle = asHeader2(H2);

const PageKeys = observer(() => {
  const { node } = useNode();
  const keys = node.keys.filter(key => key.match(/^Page/));
  return (
    <div>
      Keys:
      (from
      {' '}
      {node.path.join('$')}
      )
      <pre>
        {JSON.stringify(keys, undefined, 2)}
      </pre>
    </div>
  );
});

const library = {
  ___content$texts$office: {
    text: `
      That is a good problem to have game-plan, or clear blue
      water for we don't want to boil the ocean. Churning anomalies
      viral engagement.
    `,
  },
  ___content$texts$sagan: {
    text: `
      The carbon in our apple pies a still more glorious dawn awaits
      gathered by gravity descended from astronomers Hypatia the ash of
      stellar alchemy. 
    `,
  },
  ___content$texts$legal: {
    text: `
      Each party waives its rights to the extent caused by the copyright
      or copyrights for the electronic transfer of data. Covered Code may
      contain terms different from this Agreement are offered by that Contributor.
    `,
  },
};

const useLibraryNode = () => {
  const { node } = useNode();
  return { node: node.peer('Page$___content$texts') };
};

const SnippetPrinter = () => {
  const { node } = useNode<{ text: string}>();
  const { text } = node.data;

  return (
    <span>
      {`${text.substr(0, 30)}...`}
    </span>
  );
};

const TextDemo = flow(
  withContextActivator('onClick'),
  withLocalContextMenu,
  withContentLibrary({
    DisplayComponent: SnippetPrinter,
  }),
  addProps({ useLibraryNode }),
  asEditable(undefined, 'Text'),
  withNode,
  withNodeKey('text-library'),
)('span');

const LibraryContent = withDefaultContent(library)(Fragment);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <LibraryContent>
        <Title>Content Library</Title>
        <SectionTitle>Text with library</SectionTitle>
        <p><TextDemo /></p>
        <SectionTitle>Page Node Keys</SectionTitle>
        <PageKeys />
      </LibraryContent>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
