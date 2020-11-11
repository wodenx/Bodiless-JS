import { ComponentType } from 'react';
import { flow } from 'lodash';

export type ComponentOrTag<P> = ComponentType<P> | keyof JSX.IntrinsicElements;
export type HOC<P = any> = (C: ComponentOrTag<P>) => ComponentOrTag<P>;
export type Token<P = any> = HOC<P> & {
  category?: string;
};
export type Tokens<P = any> = {
  [key: string]: Token<P>,
};

export const asToken = <P extends object>(category?: string) => (...hocs: HOC<P>[]) => {
  const token: Token<P> = flow(...hocs);
  token.category = category;
  return token;
};

class TokenMap<P> {
  protected map = new Map<string, Token>();

  get names() {
    return Array.from(this.map.keys());
  }

  get categories() {
    const categories = new Set<string>();
    this.map.forEach(value => {
      if (value.category) categories.add(value.category);
      else categories.add('Other');
    });
    return Array.from(categories.values());
  }

  namesFor(cat: string) {
    return Array.from(this.map.keys()).reduce((acc, key) => (
      (this.map.get(key)?.category === cat) || (cat === 'Other' && !this.map.get(key)?.category)
        ? [...acc, key] : acc
    ), [] as string[]);
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
