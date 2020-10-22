import React from 'react';
import type { ComponentType } from 'react';
import { flow, omit } from 'lodash';

export type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;
export type TokenHOC<P> = (C: ComponentOrTag<P>) => ComponentType<P>;
export type Tokens<P> = { [key: string]: TokenHOC<P> };
export type TokensProps<P> = { tokens: TokenHOC<P>[], regenerate?: boolean };

const withTokensFromProps = <P extends object>(Component: ComponentOrTag<P>) => {
  class WithTokensFromProps extends React.Component<P & TokensProps<P>> {
    Component: ComponentOrTag<P>;

    OriginalComponent: ComponentOrTag<P>;

    constructor(props: P & TokensProps<P>) {
      super(props);
      const { tokens } = props;
      this.OriginalComponent = Component;
      this.Component = flow(tokens)(Component);
    }

    render() {
      const { regenerate, tokens, ...passedProps } = this.props;
      if (regenerate) {
        this.Component = flow(tokens)(this.OriginalComponent);
      }
      return <this.Component {...passedProps as P} />;
    }
  }
  return WithTokensFromProps;
};

export default withTokensFromProps;
