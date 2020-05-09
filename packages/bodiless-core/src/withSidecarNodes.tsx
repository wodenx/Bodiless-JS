
import React, { createContext, useContext, ComponentType } from 'react';
import { flowRight } from 'lodash';
import NodeProvider, { useNode } from './NodeProvider';
import { ContentNode, DefaultContentNode } from './ContentNode';
import withNode from './withNode';

const SidecarNodeContext = createContext<ContentNode<any>>(DefaultContentNode.dummy());

const SidecarProvider = ({ node, children }: any) => (
  <SidecarNodeContext.Provider value={node}>
    {children}
  </SidecarNodeContext.Provider>
);


const startSidecarNodes = <P extends object>(Component: ComponentType<P>) => (props: P) => {
  const { node } = useNode();
  return (
    <SidecarProvider node={node}>
      <Component {...props} />
    </SidecarProvider>
  );
};

const endSidecarNodes = <P extends object>(Component: ComponentType<P>) => (props: P) => {
  const node = useContext(SidecarNodeContext);
  return (
    <NodeProvider node={node}>
      <Component {...props} />
    </NodeProvider>
  );
};

type HOC = (Component: ComponentType<any>) => ComponentType<any>;

const withSidecarNodes = (...hocs: HOC[]) => flowRight(
  withNode,
  startSidecarNodes,
  ...hocs,
  endSidecarNodes,
);

export default withSidecarNodes;
