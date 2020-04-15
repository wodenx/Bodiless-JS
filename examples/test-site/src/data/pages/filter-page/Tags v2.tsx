import React, { useRef, forwardRef, useContext, createContext } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';

import Layout from '../../../components/Layout';
import { v1 } from 'uuid';
import { addClasses, Button, Div } from '@bodiless/fclasses';
import { any } from 'bluebird';
import { flow } from 'lodash';

const AddButton = addClasses('px-2 mb-2 border border-gray-600')(Button);
const TagComponentDiv = addClasses('px-3 my-2 mr-2 mb-2 border border-gray-600 inline-block')(Div);

const RefContext = createContext(null);

const withRefsFromContext = (Component: any) => (props: any) => {
  const refs = useContext(RefContext);
  const ref = useRef([]);
  refs.current.push(ref);
  return <Component ref={ref} {...props} />;
}
const forwardTagRef = (Component: any) => forwardRef(
  (props: any, ref: any) => {
    const registerTags = tags => ref.current = tags;
    return <Component {...props} registerTags={registerTags} />;
  }
);

const withRegisterTags = flow(
  forwardTagRef,
  withRefsFromContext,
);

const TagComponent = ({ suggestions, children, registerTags }) => {
  const [ tags, setTags ] = React.useState<string[]>([]);
  const addRandomTag = () => {
    setTags(oldTags => [ ...oldTags, v1() ]);
  }
  registerTags(tags);
  const showTags = () => {
    alert(JSON.stringify(suggestions()));
  }
  return(
    <TagComponentDiv>
      <h3>Tag Component: {children}</h3>
      <AddButton onClick={addRandomTag}>Add Random Tag</AddButton>
      <AddButton onClick={showTags}>Show Tags</AddButton>
      <div>
        <h4>My Tags</h4>
        <pre>{JSON.stringify(tags)}</pre>
      </div>
    </TagComponentDiv>
  );
};

type Props = {
  names: string[],
}

const TagContainerElement = withRegisterTags(TagComponent);

const TagContainer = ({ names }: Props) => {
  const refs = useRef([]);
  const suggestions = () => (
    refs.current.reduce((acc, ref) => [...acc, ...ref.current ], [])
  );
  const elements = names.map(name => (
    <TagContainerElement suggestions={suggestions}>{name}</TagContainerElement>
  ));

  return (
    <RefContext.Provider value={refs}>
      <div>
        {elements}
      </div>
    </RefContext.Provider>
  );
}

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <TagContainer names={['foo', 'bar', 'baz']} />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;