import React from 'react';
import type { ComponentType } from 'react';
import { flow } from 'lodash';
import { v4 } from 'uuid';

export type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;
export type TokenHOC<P> = (C: ComponentOrTag<P>) => ComponentType<P>;
export type Tokens<P> = { [key: string]: TokenHOC<P> };
export type TokensProps<P> = { tokens: TokenHOC<P>[] };

const withTokensFromProps = <P extends object>(Component: ComponentOrTag<P>) => {
  class WithTokensFromProps extends React.Component<P & TokensProps<P>> {
    Component: ComponentOrTag<P>;


    constructor(props: P & TokensProps<P>) {
      super(props);
      const { tokens } = props;
      this.Component = flow(tokens)(Component);
    }

    render() {
      const { tokens, ...passedProps } = this.props;
      return <this.Component {...passedProps as P} />;
    }
  }
  return WithTokensFromProps as ComponentType<P & TokensProps<P>>;
};

export const withRandomKey = <P extends object>(Component: ComponentOrTag<P>) => {
  const WithRandomKey = (props: P) => <Component {...props} key={v4()} />;
  return WithRandomKey;
}

export default withTokensFromProps;
