
import React, { createContext, useContext, ComponentType } from 'react';
import { flowRight } from 'lodash';
import NodeProvider, { useNode } from './NodeProvider';
import { ContentNode } from './ContentNode';

const SidecarNodeContext = createContext<ContentNode<any>[]>([]);

/**
 * `startSidecarNodes` is an HOC which records the current ContentNode so that
 * it can later be restored.
 *
 * @see `withSidecarNodes`
 *
 * @param Component Any component which uses the Bodiless ContentNode system.
 */
const startSidecarNodes = <P extends object>(Component: ComponentType<P>) => {
  const StartSidecarNodes = (props: P) => {
    const oldValue = useContext(SidecarNodeContext);
    const newValue = [...oldValue, useNode().node];
    return (
      <SidecarNodeContext.Provider value={newValue}>
        <Component {...props} />
      </SidecarNodeContext.Provider>
    );
  };
  StartSidecarNodes.displayName = 'StartSidecarNodes';
  return StartSidecarNodes;
};


/**
 * `endSidecarNodes` is an HOC which restores the ContentNode preserved
 * by `startSidecarNodes`.
 *
 * @see `withSidecarNodes`
 *
 * @param Component Any component which uses the Bodiless ContentNode system.
 */
const endSidecarNodes = <P extends object>(Component: ComponentType<P>) => {
  const EndSidecarNodes = (props: P) => {
    const oldValue = useContext(SidecarNodeContext);
    if (oldValue.length === 0) return <Component {...props} />;
    const newNode = oldValue[oldValue.length - 1];
    const newValue = oldValue.slice(0, -1);
    return (
      <NodeProvider node={newNode}>
        <SidecarNodeContext.Provider value={newValue}>
          <Component {...props} />
        </SidecarNodeContext.Provider>
      </NodeProvider>
    );
  };
  EndSidecarNodes.displayName = 'EndSidecarNodes';
  return EndSidecarNodes;
};

type HOC = (Component: ComponentType<any>) => ComponentType<any>;

/**
 * `withSidecarNodes` allows you to establish a `ContentNode` sub-hierarchiy which should
 * be used by a series of one or more HOC's. Any nodes created by the HOC's enclosed in this
 * wrapper will not affect the hierarchy for subsequent HOC's *outside* the wrapper. For
 * example:
 * ```js
 * flowRight(
 *   ...
 *   withNodeKey('foo'), withNode,  // ...$foo
 *   withSidecarNodes(
 *     withNodeKey('bar'), withNode,  // ...$foo$bar
 *   ),
 *   withNodeKey('baz'); withNode, // ...$foo$baz (otherwise would be ...$foo$bar$baz)
 *   ...
 * )
 * ```
 * This is useful, for example, if you want to apply an enhancment HOC which uses its own
 * content node(s) without affecting the node paths of other children of the wrapped compoenent.
 *
 * @param hocs A list of HOC's to be applied using the parallel node hierarchy.  These will
 *             be composed using lodash `flowRight`
 *
 * @return an HOC which can wrap any Component using the Bodiless `ContentNode` system.
 */
const withSidecarNodes = (...hocs: HOC[]) => flowRight(
  startSidecarNodes,
  ...hocs,
  endSidecarNodes,
);

export default withSidecarNodes;
export { startSidecarNodes, endSidecarNodes };
