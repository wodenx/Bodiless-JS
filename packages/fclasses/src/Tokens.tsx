import React, { ComponentType } from 'react';
import {
  flow, isArray, mergeWith, union,
} from 'lodash';

/**
 * Metadata which can be attached to a token.
 *
 * When the token is applied, these metadata will also be attached to the
 * target component.  If multiple tokens are applied, their metadata will
 * be merged onto the component.
 */
type TokenMeta = {
  title?: string,
  displayName?: string,
  description?: string,
  categories?: {
    [cat:string]: string[],
  }
};

/**
 * A component with metadata supplied by one or more tokens.
 */
type ComponentWithMeta<P = any> = ComponentType<P> & TokenMeta;

type HOCBase<P = any, Q = P> = ((c:ComponentWithMeta<P>|string) => ComponentWithMeta<Q>);
type TokenProps<P> = {
  /**
   * A method which produces a new Token by removing composed tokens which match
   * specified criteria. Filtering is recursive, so that composed tokens which
   * have a filter method will themselves be filtered.
   */
  filter: (test: TokenFilter<P>) => TokenWithMeta<P>,
  /**
   * The metadata attached to this token. This metadata will be merged recursively with
   * any metadata provided by any other tokens which this token composes, and attached to any
   * component to which this token is applied.
   */
  meta: TokenMeta,
};

/**
 * A "Token" is an HOC with optional metadata.
 *
 * Tokens may be composed of other tokens using the `asToken` utility.
 */
type Token<P = any, Q = P> = HOCBase<P, Q> & Partial<TokenProps<P>>;

/**
 * Type of the filter function which should be passed to the Token#filter method.
 */
type TokenFilter<P> = (hoc: Token<P>) => boolean;

type TokenWithMeta<P = any, Q = P> = HOCBase<P, Q> & TokenProps<P>;

// Custom merge behavior for token categories.
function mergeMeta(objValue:any, srcValue:any) {
  if (isArray(objValue)) {
    // @TODO This should probably be union...
    return union(objValue, srcValue);
  }
  return undefined;
}

const preserveMeta = <P extends object>(hoc: Token<P>): Token<P> => Component => {
  const NewComponent = hoc(Component);
  const finalMeta = mergeWith({}, Component, NewComponent, mergeMeta);
  return Object.assign(NewComponent, finalMeta);
};

const withMeta = <P extends object>(meta: TokenMeta): Token<P> => Component => {
  const WithMeta = (props: P) => <Component {...props} />;
  return Object.assign(WithMeta, meta);
};

/**
 * Utility which can be used to add metadata when composing tokens with `asToken`.
 * Metadata added in this fashion will be applied to the composed token. Note that
 * metadata from all composed tokens will be added to the target component when
 * a token is applied.
 *
 * @param meta The token metadata to add.
 *
 * @return token metadata.
 */
const addMeta = (meta: TokenMeta): TokenMeta => ({ ...meta });

/**
 * Takes a category and creates a function which adds a term to the token in
 * that category.
 *
 * @param category The name of the category to add
 * @return A function which takes a term and returns token metadata including that term.
 */
addMeta.term = (category: string) => (term: string): TokenMeta => ({
  categories: {
    [category]: [term],
  },
});

/**
 * Adds a title to the token metadata.
 *
 * @param title
 */
addMeta.title = (title: string): TokenMeta => ({ title });

/**
 * Adds a description to the token metadata.
 *
 * @param description The description to add.
 */
addMeta.desc = (description: string): TokenMeta => ({ description });

/**
 * Composes one or more HOC's into a single token.
 *
 * A Token may have attached metadata which is supplied by including
 *
 * metadata objects in the list of HOCs. Metadata attached to the token
 * (and to any tokens of which it is composed) will be aggregated and attached
 * to any component to which this token is applied.
 *
 * HOCs will be composed left-to-right (in lodash "flow" order). To compose
 * right-to-left use `flowTokensRight`.
 *
 * Tokens created with this utility have the optional `meta` property and
 * `filter` method added.
 *
 * @see TokenProps
 *
 * @param hocs List of token HOCs and/or token metadata to compose.
 *
 * @return A composed token.
 */
const asToken = <P extends object>(...hocs: (Token<P>|TokenMeta)[]): TokenWithMeta<P> => {
  const hocList: Token<P>[] = hocs.filter(h => typeof h === 'function') as Token<P>[];
  const metaBits = hocs.filter(h => typeof h !== 'function') as TokenMeta[];
  const meta = mergeWith({}, ...metaBits, mergeMeta);
  hocList.push(withMeta(meta));
  const token = flow(...hocList.map(hoc => preserveMeta(hoc))) as TokenWithMeta<P>;
  token.meta = meta;
  token.filter = test => asToken(...hocList
    .filter(test)
    .map(hoc => (hoc.filter ? hoc.filter(test) : hoc)));
  return token;
};

/**
 * Composes tokens right-to-left (similar to lodash `flowRight`.
 *
 * @see asToken
 *
 * @param hocs List of token HOCs and/or token metadata to compose.
 *
 * @return A composed token.
 */
const flowTokensRight = <P extends object>(...hocs: Token<P>[]) => (
  asToken(...hocs.reverse())
);

export type {
  Token, TokenFilter, TokenMeta, ComponentWithMeta,
};
export { addMeta, asToken, flowTokensRight };
