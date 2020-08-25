import { asEditableList, List } from '@bodiless/components';
import {
  WithNodeKeyProps, withNodeKey, useNode, NodeProvider,
} from '@bodiless/core';
import React, { ComponentType, PropsWithChildren, FC } from 'react';
import { flow } from 'lodash';
import { replaceWith, withDesign, asComponent } from '@bodiless/fclasses';

type Data = {
  items?: string[],
};

type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;

export type TitledItemProps = PropsWithChildren<{
  title: JSX.Element,
}>;

export const asTitledItem = <P extends TitledItemProps>(Item: ComponentType<P>) => {
  const TitledItem: ComponentType<P> = ({ children, ...rest }) => {
    // prepare and pass the submenu title as a prop according to rc-menu <SubMenu /> specification
    // wrap the title with current node,
    // otherwise the title will read data from incorrect node when it is rendered by <SubMenu />
    const { node } = useNode();
    const children$ = <NodeProvider node={node}>{children}</NodeProvider>;
    return (
      <Item title={children$} {...rest as any} />
    );
  };
  return TitledItem;
};

const SubList: FC<TitledItemProps> = ({ title, children, ...rest }) => (
  <li {...rest}>
    {title}
    <ul>
      {children}
    </ul>
  </li>
);

const asBodilessList = (
  nodeKeys?: WithNodeKeyProps,
  // @TODO - Handle default data
  // defaultData?: Data,
) => <P extends object>(Component: ComponentOrTag<P>) => flow(
  replaceWith(List),
  asEditableList,
  withDesign({
    Wrapper: replaceWith(typeof Component === 'string' ? asComponent(Component) : Component),
  }),
  withNodeKey(nodeKeys),
)(Component);

export const asSubList = flow(
  asBodilessList(),
  withDesign({
    Wrapper: replaceWith(SubList),
  }),
  asTitledItem,
);

export default asBodilessList;
