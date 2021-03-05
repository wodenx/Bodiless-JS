import { flow } from 'lodash';

import { asToken } from '@bodiless/fclasses';
import type { Token } from '@bodiless/fclasses';

export type Tokens = {
  [key: string]: Token,
};

export const withCategory = <P extends object>(category?: string) => (...hocs: Token[]) => (
  asToken(
    ...hocs,
    category ? asToken.meta.term('Categories')(category) : undefined,
  )
);

const tokCat = (token?: Token) => token?.meta?.categories?.Category || [];

class TokenMap<P> {
  protected map = new Map<string, Token>();

  get names() {
    return Array.from(this.map.keys());
  }

  get categories() {
    const categories = new Set<string>();
    this.map.forEach(value => {
      tokCat(value).forEach(c => categories.add(c));
    });
    return Array.from(categories.values());
  }

  namesFor(cat: string) {
    return Array.from(this.map.keys()).reduce((acc, key) => {
      const tok = this.map.get(key);
      if (tokCat(tok).includes(cat) || (tokCat(tok).length === 0 && cat === 'Other')) {
        return [...acc, key];
      }
      return acc;
    }, [] as string[]);
  }

  set(name: string, token: Token) {
    this.map.set(name, token);
  }

  add(tokens: Tokens) {
    Object.keys(tokens).forEach(
      key => this.set(key, tokens[key]),
    );
  }

  delete(name: string) {
    this.map.delete(name);
  }

  flow<P>(tokens: string[] = []) {
    const tokenHOCs = tokens.reduce((hocs, name) => {
      const hoc = this.map.get(name);
      if (!hoc) return [...hocs];
      return [...hocs, hoc];
    }, [] as Token[]);
    return flow(...tokenHOCs) as Token;
  }
}

export default TokenMap;
