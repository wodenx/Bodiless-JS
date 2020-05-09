
import React, { createContext, useContext, ComponentType } from 'react';
import { flowRight } from 'lodash';
import NodeProvider, { useNode } from './NodeProvider';
import { ContentNode, DefaultContentNode } from './ContentNode';
import withNode from './withNode';

const SidecarNodeContext = createContext<ContentNode<any>>(DefaultContentNode.dummy());

const startSidecarNodes = <P extends object>(Component: ComponentType<P>) => (props: P) => (
  <SidecarNodeContext.Provider value={useNode().node}>
    <Component {...props} />
  </SidecarNodeContext.Provider>
);

const endSidecarNodes = <P extends object>(Component: ComponentType<P>) => (props: P) => (
  <NodeProvider node={useContext(SidecarNodeContext)}>
    <Component {...props} />
  </NodeProvider>
);

type HOC = (Component: ComponentType<any>) => ComponentType<any>;

const withSidecarNodes = (...hocs: HOC[]) => flowRight(
  withNode,
  startSidecarNodes,
  ...hocs,
  endSidecarNodes,
);

export default withSidecarNodes;
