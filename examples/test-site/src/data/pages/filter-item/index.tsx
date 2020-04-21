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
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  Editable,
  asTaggableItem,
  asFilterableItem,
  withFilterByTags,
} from '@bodiless/components';
import { H2, Button, addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import Layout from '../../../components/Layout';

const TagButton = addClasses('px-2 mb-2 mr-2 border border-gray-600')(Button);

const getSuggestions = () => [
  { id: 0, name: 'Bananas' },
  { id: 1, name: 'Mangos' },
  { id: 2, name: 'Lemons' },
  { id: 3, name: 'Apricots' },
];
const inputAttributes = { name: 'react-tags' };
const TaggableItem = flow(withFilterByTags, asTaggableItem())('span');
const TaggableFilterSelector = () => {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div>
      <div>
        <H2>Select a tag to filter by</H2>
        <TagButton id="show-foo" type="button" onClick={() => setTags(['foo'])}>
          foo
        </TagButton>
        <TagButton id="show-bar" type="button" onClick={() => setTags(['bar'])}>
          bar
        </TagButton>
        <TagButton id="show-baz" type="button" onClick={() => setTags(['baz'])}>
          baz
        </TagButton>
        <TagButton id="show-bat" type="button" onClick={() => setTags(['bat'])}>
          bat
        </TagButton>
        <TagButton id="show-all" type="button" onClick={() => setTags([])}>
          All
        </TagButton>
      </div>
      <div>
        <h2>Filtered Components</h2>
        <TaggableItem nodeKey="foo" selectedTags={tags} id="foo">
          foo
        </TaggableItem>
        <TaggableItem nodeKey="bar" selectedTags={tags} id="bar">
          bar
        </TaggableItem>
        <TaggableItem nodeKey="baz" selectedTags={tags} id="baz">
          baz
        </TaggableItem>
        <TaggableItem nodeKey="bat" selectedTags={tags} id="bat">
          bat
        </TaggableItem>
      </div>
    </div>
  );
};

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Metadata (tags) Group Demo Page</h1>
      <p>
        Below is an editable component that can take metadata (tags/groups) So
        that an end user to hide it with a filter.
      </p>
      <div className="my-3">
        <TaggableItem
          nodeKey="tags"
          getSuggestions={getSuggestions}
          placeholder="Add or create"
          allowNew
          noSuggestionsText="No suggestions found"
          inputAttributes={inputAttributes}
        >
          <Editable nodeKey="text" placeholder="Editable Text" />
        </TaggableItem>
      </div>

      <div className="my-3">
        <TaggableFilterSelector />
      </div>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
