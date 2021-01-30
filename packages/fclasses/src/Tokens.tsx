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

type TokenDef<P> = {
  meta?: TokenMeta,
  filter?: TokenFilter<P>,
  hoc?: Token<P>
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
const addMeta = <P extends object>(meta: TokenMeta): TokenDef<P> => ({ meta: { ...meta } });

/**
 * Takes a category and creates a function which adds a term to the token in
 * that category.
 *
 * @param category The name of the category to add
 * @return A function which takes a term and returns token metadata including that term.
 */
addMeta.term = <P extends object>(category: string) => (term: string): TokenDef<P> => addMeta({
  categories: {
    [category]: [term],
  },
});

/**
 * Adds a title to the token metadata.
 *
 * @param title
 */
addMeta.title = <P extends object>(title: string): TokenDef<P> => addMeta({ title });

/**
 * Adds a description to the token metadata.
 *
 * @param description The description to add.
 */
addMeta.desc = (description: string): TokenMeta => ({ description });

/**
 * Composes one or more token definitions into a single token.
 *
 * Tokens will be composed left-to-right (in lodash "flow" order). To compose
 * right-to-left use `flowTokensRight`.
 *
 * Tokens created with this utility have the optional `meta` property and
 * `filter` method added.
 *
 * @see TokenProps
 * @see TokenDefinition
 *
 * @param hocs List of token HOCs and/or token definitions to compose.
 *
 * @return A composed tokenif .
 */
const asToken = <P extends object>(...args: (Token<P>|TokenDef<P>)[]): TokenWithMeta<P> => {
  // Normalize the arguments to a list of TokenDef objects.
  const defs: TokenDef<P>[] = args.map(
    hoc => (typeof hoc === 'function' ? { hoc } : hoc) as TokenDef<P>,
  );

  // Build the list of constituent hocs.
  const hocs = defs
    .reduce((acc, def) => {
      const { hoc, filter } = def;
      const nextHocs = hoc ? [...acc, hoc] : acc;
      if (!filter) return nextHocs;
      return nextHocs
        .filter(filter)
        .map(h => (h.filter ? h.filter(filter) : h));
    }, [] as Token<P>[]);

  // Build the metadata
  const metaBits: TokenMeta[] = defs
    .map(def => def.meta as TokenMeta)
    .filter(Boolean);
  const meta = mergeWith({}, ...metaBits, mergeMeta);
  hocs.push(withMeta(meta));

  const token = flow(...hocs.map(hoc => preserveMeta(hoc))) as TokenWithMeta<P>;
  token.meta = meta;
  token.filter = (filter) => asToken(...hocs, { filter });
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
