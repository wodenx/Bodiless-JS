/**
 * Copyright © 2020 Johnson & Johnson
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
import React, { useRef, forwardRef } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';

import Layout from '../../../components/Layout';
import { v1 } from 'uuid';


const TagComponent = forwardRef(({ suggestions }: any, ref) => {
  const [ tags, setTags ] = React.useState<string[]>([]);
  const addRandomTag = () => {
    setTags(oldTags => [ ...oldTags, v1() ]);
  }
  ref.current = tags;
  const showTags = () => {
    alert(JSON.stringify(suggestions()));
  }
  return(
    <div className="p-2 border">
      <h3>Tag Component</h3>
      <a onClick={addRandomTag}>Add Random Tag</a>
      <a onClick={showTags}>Show Tags</a>
      <div>
        <h4>My Tags</h4>
        <pre>{JSON.stringify(tags)}</pre>
      </div>
    </div>
  );
});

const TagContainer = () => {
  const ref1 = useRef();
  const suggestions = () => ref1.current;
  return (
    <TagComponent ref={ref1} suggestions={suggestions} />
  );
}

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <TagContainer />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
